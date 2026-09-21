import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:net';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';

async function port() {
 const s=createServer();s.listen(0,'127.0.0.1');await once(s,'listening');const p=s.address().port;await new Promise(r=>s.close(r));return p;
}
async function start(env={}) {
 const p=await port();
 const child=spawn(process.execPath,['server/index.mjs'],{cwd:new URL('..',import.meta.url),env:{PATH:process.env.PATH,HOST:'127.0.0.1',PORT:String(p),LOG_LEVEL:'silent',...env},stdio:['ignore','pipe','pipe']});
 let output='';child.stderr.on('data',d=>output+=d);child.stdout.on('data',d=>output+=d);
 const base=`http://127.0.0.1:${p}`;
 for(let i=0;i<100;i++) {
  if(child.exitCode!==null) throw new Error(output);
  try{if((await fetch(base+'/api/health')).ok)return {base,stop:async()=>{const done=once(child,'exit');child.kill('SIGTERM');await done;}};}catch{}
  await delay(50);
 }
 child.kill();throw new Error('Server startup timeout '+output);
}
async function smtp(reject=false) {
 const messages=[];const sockets=new Set();
 const server=createServer(socket=>{
  sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>{});
  socket.write('220 local.test ESMTP\r\n');let buffer='',body='',data=false;
  socket.on('data',chunk=>{
   buffer+=chunk.toString();let index;
   while((index=buffer.indexOf('\r\n'))>=0) {
    const line=buffer.slice(0,index);buffer=buffer.slice(index+2);
    if(data){if(line==='.') {messages.push(body);body='';data=false;socket.write('250 queued locally\r\n');}else body+=line+'\n';continue;}
    if(/^EHLO|^HELO/.test(line))socket.write('250-local.test\r\n250 8BITMIME\r\n');
    else if(/^MAIL FROM/.test(line))socket.write('250 OK\r\n');
    else if(/^RCPT TO/.test(line))socket.write(reject?'550 rejected for test\r\n':'250 OK\r\n');
    else if(line==='DATA'){data=true;socket.write('354 send message\r\n');}
    else if(line==='QUIT'){socket.end('221 bye\r\n');}
    else socket.write('250 OK\r\n');
   }
  });
 });
 server.listen(0,'127.0.0.1');await once(server,'listening');
 return {messages,env:{SMTP_HOST:'127.0.0.1',SMTP_PORT:String(server.address().port),MAIL_TO:'inbox@local.test',MAIL_FROM:'form@local.test'},stop:async()=>{for(const s of sockets)s.destroy();await new Promise(r=>server.close(r));}};
}
const valid={secteur:'Autre',irritants:'',nom:'Test local',email:'test@example.test',societe:'Test local',telephone:'',message:'Un besoin de test local.',consentement:true,site_web:'',dureeRemplissage:4000};
async function post(app,data){const r=await fetch(app.base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});return {status:r.status,body:await r.json()};}

test('contact : contrat V1, validation, rapidité et limitation, avec SMTP local uniquement',async()=>{
 const mail=await smtp();const app=await start(mail.env);
 try{
  assert.deepEqual(await post(app,valid),{status:200,body:{ok:true}});
  assert.deepEqual(await post(app,{...valid,societe:'Deuxième test'}),{status:200,body:{ok:true}});
  assert.equal(mail.messages.length,2);
  assert.match(mail.messages[1],/Secteur : Autre/);
  const invalid=await post(app,{...valid,email:'invalide',nom:'  '});assert.equal(invalid.status,400);assert.ok(invalid.body.champs.includes('email'));assert.ok(invalid.body.champs.includes('nom'));
  assert.equal((await post(app,{...valid,secteur:'inconnu'})).status,400);
  assert.deepEqual(await post(app,{...valid,dureeRemplissage:5}),{status:422,body:{ok:false,erreur:'trop_rapide'}});
  assert.equal((await post(app,valid)).status,429);
  assert.equal(mail.messages.length,2,'invalid requests must not produce mail');
 }finally{await app.stop();await mail.stop();}
});
test('contact : indisponibilité explicite et piège anti-spam silencieux',async()=>{
 const app=await start();try{
  assert.deepEqual(await post(app,valid),{status:503,body:{ok:false,erreur:'indisponible'}});
  assert.deepEqual(await post(app,{...valid,site_web:'bot.example'}),{status:200,body:{ok:true}});
  assert.equal((await post(app,{...valid,consentement:false})).status,400);
 }finally{await app.stop();}
});
test('contact : un rejet SMTP ne produit jamais de succès',async()=>{
 const mail=await smtp(true);const app=await start(mail.env);try{
  assert.deepEqual(await post(app,valid),{status:502,body:{ok:false,erreur:'envoi'}});assert.equal(mail.messages.length,0);
 }finally{await app.stop();await mail.stop();}
});
test('cohabitation : V1, V2 isolée, contact désactivé, liens et non-indexation',async()=>{
 const app=await start();
 try {
  const home=await (await fetch(app.base+'/')).text();
  assert.ok(!home.includes('Moins de ressaisie.'));
  assert.ok((await (await fetch(app.base+'/contact')).text()).includes('<form'));
  for(const path of ['/v2','/v2/','/v2/accompagnement','/v2/realisations/atelier-sols-fils','/v2/editeurs','/v2/a-propos','/v2/contact']) {
   const res=await fetch(app.base+path);assert.equal(res.status,200,path);
   assert.match(res.headers.get('x-robots-tag'),/noindex/);
   const html=await res.text();assert.match(html,/<meta name="robots" content="noindex"/);
   assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
   assert.ok(!html.includes('<form'),path+' must not contain a form');
   for(const [,target] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g)) {
    assert.ok(target.startsWith('/v2/'),`V2 path escaped: ${target}`);
    assert.equal((await fetch(app.base+target)).status,200,target);
   }
  }
  assert.equal((await fetch(app.base+'/v2/sitemap.xml')).status,404);
  assert.equal((await fetch(app.base+'/v2/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(valid)})).status,404);
  const missing=await fetch(app.base+'/v2/missing');assert.equal(missing.status,404);assert.match(missing.headers.get('x-robots-tag'),/noindex/);assert.ok((await missing.text()).includes('href="/v2/"'));
  assert.equal((await fetch(app.base+'/missing')).status,404);
 } finally {await app.stop();}
});

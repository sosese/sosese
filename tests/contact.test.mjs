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
const valid={intention:'entreprise',nom:'Test local',email:'test@example.test',societe:'',telephone:'',message:'Un besoin de test local.',consentement:true,site_web:'',dureeRemplissage:4000};
async function post(app,data){const r=await fetch(app.base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});return {status:r.status,body:await r.json()};}

test('contact : deux intentions, validation, rapidité et limitation, avec SMTP local uniquement',async()=>{
 const mail=await smtp();const app=await start(mail.env);
 try{
  assert.deepEqual(await post(app,valid),{status:200,body:{ok:true}});
  assert.deepEqual(await post(app,{...valid,intention:'editeur',societe:'Logiciel test'}),{status:200,body:{ok:true}});
  assert.equal(mail.messages.length,2);
  assert.match(mail.messages[1],/Intention : editeur/);
  const invalid=await post(app,{...valid,email:'invalide',message:'  '});assert.equal(invalid.status,400);assert.ok(invalid.body.champs.includes('email'));assert.ok(invalid.body.champs.includes('message'));
  assert.equal((await post(app,{...valid,intention:'inconnue'})).status,400);
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
test('pages : routes, liens locaux, titres, canonical, sitemap, CSP et 404',async()=>{
 const app=await start();const paths=['/','/accompagnement','/realisations/atelier-sols-fils','/editeurs','/a-propos','/contact','/mentions-legales','/confidentialite'];
 try{
  const checked=new Set();const titles=new Set();
  for(const path of paths){
   const res=await fetch(app.base+path);assert.equal(res.status,200,path);assert.match(res.headers.get('content-security-policy'),/script-src 'self'/);
   const html=await res.text();assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path);
   const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title));titles.add(title);
   assert.ok(html.includes(`href="https://sosese.tech${path}"`),`canonical ${path}`);
   for(const [,target] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g)){
    if(checked.has(target))continue;checked.add(target);assert.equal((await fetch(app.base+target)).status,200,`broken ${target} on ${path}`);
   }
  }
  assert.equal((await fetch(app.base+'/unknown-local-test')).status,404);
  assert.equal((await fetch(app.base+'/labo')).status,404);
  const sitemap=await (await fetch(app.base+'/sitemap.xml')).text();for(const p of paths.slice(0,6))assert.ok(sitemap.includes('https://sosese.tech'+p));
  assert.match(await (await fetch(app.base+'/robots.txt')).text(),/Sitemap: https:\/\/sosese.tech\/sitemap.xml/);
 }finally{await app.stop();}
});

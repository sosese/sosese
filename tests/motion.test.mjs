import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Execute the shipped native scripts with the OS motion preference enabled.
// No browser timing or incidental implementation-specific class assertions.
for (const file of ['VracEnActions.astro','EnchainementClient.astro']) {
 test(`${file}: reduced motion starts no animation timer`,()=>{
  const source=readFileSync(new URL(`../src/components/ui/diagrams/${file}`,import.meta.url),'utf8');
  const script=source.match(/<script>([\s\S]*?)<\/script>/)[1];
  let timers=0;const attrs=new Map();
  const node={querySelector:()=>node,setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:()=>{},addEventListener:()=>{},classList:{toggle:()=>{}}};
  runInNewContext(script,{document:{querySelector:()=>node},window:{matchMedia:()=>({matches:true,addEventListener:()=>{}}),setTimeout:()=>{timers++;},clearTimeout:()=>{}},Date});
  assert.equal(timers,0);
  if(file==='VracEnActions.astro')assert.equal(attrs.get('data-etape'),'5','the useful result stays visible');
 });
}

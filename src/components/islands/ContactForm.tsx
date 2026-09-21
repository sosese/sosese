import {useEffect, useRef, useState, type FormEvent} from "react";
import regles from "../../../shared/contact.json";

const inputClass="w-full rounded-md border border-border-strong bg-bg px-4 py-3 text-16 text-ink";
const fields = [
 {name:"nom", label:"Votre nom", type:"text", autoComplete:"name", required:true},
 {name:"email", label:"Votre email", type:"email", autoComplete:"email", required:true},
 {name:"societe", label:"Entreprise ou logiciel", type:"text", autoComplete:"organization", required:false},
 {name:"telephone", label:"Téléphone", type:"tel", autoComplete:"tel", required:false},
] as const;

export default function ContactForm({fallbackEmail}:{fallbackEmail:string}) {
 const [ready,setReady]=useState(false);
 const [intention,setIntention]=useState("entreprise");
 const [status,setStatus]=useState<"idle"|"sending"|"success"|"error">("idle");
 const [error,setError]=useState("");
 const [invalid,setInvalid]=useState<string[]>([]);
 const started=useRef(0);
 const result=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  started.current=Date.now();
  if(new URLSearchParams(window.location.search).get("intention")==="editeur") setIntention("editeur");
  setReady(true);
 },[]);
 useEffect(()=>{if(status==="success") result.current?.focus();},[status]);

 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if(!ready || status==="sending") return;
  const form=event.currentTarget;
  const data=new FormData(form);
  const get=(key:string)=>String(data.get(key)??"").trim();
  const localInvalid=fields.filter(f=>f.required&&!get(f.name)).map(f=>f.name as string);
  if(!get("message")) localInvalid.push("message");
  if(!new RegExp(regles.emailRegex).test(get("email"))) localInvalid.push("email");
  if(get("telephone")&&!new RegExp(regles.telephoneRegex).test(get("telephone"))) localInvalid.push("telephone");
  if(localInvalid.length) {
   setInvalid(localInvalid);setStatus("error");setError("Vérifiez les champs signalés. Le nom, un email valide et un message sont nécessaires.");
   form.querySelector<HTMLElement>(`[name="${localInvalid[0]}"]`)?.focus();return;
  }
  setInvalid([]);setError("");setStatus("sending");
  try {
   const response=await fetch(regles.endpoint,{
    method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
    signal:AbortSignal.timeout(15000),
    body:JSON.stringify({intention,nom:get("nom"),email:get("email"),societe:get("societe"),telephone:get("telephone"),message:get("message"),consentement:data.get("consentement")==="on",[regles.champPiege]:get(regles.champPiege),dureeRemplissage:Math.max(0,Date.now()-started.current)}),
   });
   const body=await response.json().catch(()=>null);
   if(response.ok && body?.ok===true) { form.reset();setStatus("success");return; }
   if(response.status===400 && body?.erreur==="validation") {
    const known=[...fields.map(f=>f.name),"message","intention","consentement"];
    const bad=Array.isArray(body.champs)?body.champs.filter((n:unknown)=>typeof n==="string"&&known.includes(n as never)):[];
    setInvalid(bad);
    if(bad.length) form.querySelector<HTMLElement>(`[name="${bad[0]}"]`)?.focus();
   }
   const messages:Record<number,string>={400:"Vérifiez les champs signalés avant de réessayer.",422:"L’envoi a été trop rapide. Patientez quelques secondes puis réessayez.",429:"Trop de tentatives ont été effectuées. Réessayez dans dix minutes, ou utilisez l’email ci-dessous.",503:"Le formulaire est momentanément indisponible. Vous pouvez utiliser l’email ci-dessous.",502:"Le serveur de messagerie n’a pas accepté l’envoi. Réessayez ou utilisez l’email ci-dessous."};
   setError(messages[response.status]??"L’envoi n’a pas pu être confirmé. Vous pouvez réessayer ou écrire directement par email.");setStatus("error");
  } catch {
   setError("L’envoi n’a pas pu être confirmé (connexion interrompue ou délai dépassé). Vos champs restent remplis ; si vous réessayez, signalez qu’il peut s’agir d’un doublon.");setStatus("error");
  }
 }
 if(status==="success") return <div ref={result} tabIndex={-1} role="status" className="flex flex-col gap-4 py-8 focus:outline-none"><p className="eyebrow">Envoi pris en charge</p><h2 className="text-28 font-semibold">Merci pour votre message.</h2><p className="text-16 text-ink-muted">Votre demande a été acceptée par le service de messagerie. La suite de l’échange se fera à l’adresse email indiquée.</p><a className="v2-link" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a></div>;
 return <form onSubmit={submit} action={regles.endpoint} method="post" className="flex flex-col gap-6">
  <p className="text-14 text-ink-muted">Les champs marqués * sont obligatoires.</p>
  <fieldset><legend className="mb-3 text-16 font-medium">Votre projet concerne…</legend><div className="grid gap-3 sm:grid-cols-2">
   {[['entreprise','Mon entreprise'],['editeur','Mon logiciel, en tant qu’éditeur']].map(([value,label])=><label key={value} className="flex cursor-pointer items-start gap-3 rounded-md border border-border-strong bg-bg p-4 text-14 has-checked:border-accent has-checked:bg-accent-soft"><input className="mt-1 accent-accent" type="radio" name="intention" value={value} checked={intention===value} onChange={()=>setIntention(value)}/><span>{label}</span></label>)}
  </div></fieldset>
  <div className="grid gap-6 sm:grid-cols-2">{fields.map(f=><div key={f.name} className="flex flex-col gap-2"><label className="text-14 font-medium" htmlFor={f.name}>{f.label}{f.required?" *":" (facultatif)"}</label><input {...f} id={f.name} maxLength={regles.limites[f.name]} className={inputClass} aria-invalid={invalid.includes(f.name)} aria-describedby={invalid.includes(f.name)?`${f.name}-erreur`:undefined} onChange={()=>setInvalid(v=>v.filter(n=>n!==f.name))}/>{invalid.includes(f.name)&&<p id={`${f.name}-erreur`} className="text-14">Vérifiez ce champ et son format.</p>}</div>)}</div>
  <div className="flex flex-col gap-2"><label htmlFor="message" className="text-14 font-medium">{intention==="editeur"?"Votre logiciel et l’usage envisagé":"La tâche que vous aimeriez simplifier"} *</label><p id="message-aide" className="text-14 text-ink-muted">{intention==="editeur"?"Le nom du logiciel, un usage client et les accès disponibles, si vous les connaissez.":"Vos outils et ce qui vous prend du temps. Pas encore de besoin précis ? Dites-le simplement."} N’incluez pas de données clients confidentielles.</p><textarea className={`${inputClass} min-h-32 resize-y`} rows={5} id="message" name="message" required maxLength={regles.limites.message} aria-invalid={invalid.includes("message")} aria-describedby="message-aide" onChange={()=>setInvalid(v=>v.filter(n=>n!=="message"))}/></div>
  <div className="sr-only" aria-hidden="true"><label htmlFor={regles.champPiege}>Ne pas remplir ce champ</label><input id={regles.champPiege} name={regles.champPiege} tabIndex={-1} autoComplete="off"/></div>
  <label className="flex items-start gap-3 text-14"><input className="mt-1 size-5 shrink-0 accent-accent" type="checkbox" name="consentement" required aria-invalid={invalid.includes("consentement")}/><span>J’accepte que ces informations soient utilisées pour répondre à ma demande. Rien d’autre, voir la <a className="v2-link" href="/v2/confidentialite">politique de confidentialité</a>. *</span></label>
  <div role="alert">{status==="error"&&<div className="rounded-md border border-accent bg-accent-soft p-4 text-14"><p>{error}</p><p className="mt-2">Vos informations restent dans le formulaire. Email : <a className="v2-link" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.</p></div>}</div>
  <div><button type="submit" disabled={!ready||status==="sending"} className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-6 py-3 text-16 font-medium text-on-accent hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70">{status==="sending"?"Envoi en cours…":"Envoyer ma demande"}</button><p role="status" className="mt-3 text-14 text-ink-muted">{status==="sending"?"Transmission de votre demande…":""}</p></div>
 </form>;
}

import{a as N,r,j as e,H as w}from"./app-Q65XCdK4.js";import{s as k}from"./index-ikzcNs2d.js";import{C as c}from"./circle-check-big-UwC736GH.js";import{c as z}from"./createLucideIcon-DvAYr2T0.js";import{A as C}from"./arrow-right-Dv8EjJJs.js";import{H as S}from"./house-BN73pifH.js";import{R as D}from"./receipt-BCcTvqKy.js";import{S as M}from"./share-2-L6QF-BrC.js";import{D as P}from"./download-DYSWuROd.js";import{S as R}from"./shield-DvGq7UV4.js";import{C as $}from"./credit-card-CaxfelaN.js";import{Z as A}from"./zap-zl8eEUAO.js";/* empty css            *//**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],L=z("Sparkles",T);function O(){const{props:m}=N(),{payment:a,order:F}=m,[l,d]=r.useState(!1),[x,i]=r.useState(!1),[u,h]=r.useState(!1),[t,p]=r.useState(!1),[f,b]=r.useState([]);r.useEffect(()=>{h(!0),setTimeout(()=>p(!0),300);const s=[...Array(20)].map((o,g)=>({id:g,x:50,y:50,vx:(Math.random()-.5)*15,vy:(Math.random()-.5)*15,size:Math.random()*4+2,opacity:1,color:["#10b981","#3b82f6","#8b5cf6","#ec4899"][Math.floor(Math.random()*4)]}));b(s)},[]);const j=s=>new Date(s).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),n=s=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(s),y=async s=>{try{await navigator.clipboard.writeText(s),i(!0),setTimeout(()=>i(!1),2e3)}catch(o){console.error("Failed to copy:",o)}},v=async()=>{if(navigator.share)try{await navigator.share({title:"Paiement réussi !",text:`J'ai effectué un paiement de ${n(a?.amount||0)} avec succès !`,url:window.location.href})}catch(s){console.log("Share failed:",s)}};return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Paiement Réussi - The AgencyDRC"}),e.jsxs("div",{className:"relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",children:[e.jsx("div",{className:"absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"}),t&&e.jsx("div",{className:"pointer-events-none absolute inset-0 z-50",children:f.map(s=>e.jsx("div",{className:"absolute h-2 w-2 rounded-full",style:{backgroundColor:s.color,left:"50%",top:"50%",transform:"translate(-50%, -50%)",animation:"explode 1.5s ease-out forwards","--vx":`${s.vx}rem`,"--vy":`${s.vy}rem`,"--size":`${s.size}px`}},s.id))}),e.jsx("div",{className:"relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20",children:e.jsx("div",{className:"mx-auto max-w-4xl",children:e.jsxs("div",{className:`transform rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-1000 sm:p-12 lg:p-16 ${u?"translate-y-0 scale-100 opacity-100":"translate-y-8 scale-95 opacity-0"}`,children:[e.jsx("div",{className:"mb-8 flex justify-center",children:e.jsxs("div",{className:`relative ${t?"animate-bounce-in":""}`,children:[e.jsx("div",{className:"flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl",children:e.jsx(c,{size:48,className:"text-white"})}),t&&e.jsx("div",{className:"absolute inset-0 h-24 w-24 animate-ping rounded-full bg-emerald-400 opacity-30"}),e.jsx(L,{className:"absolute -top-4 -right-4 h-8 w-8 animate-spin text-emerald-400",size:32})]})}),e.jsxs("div",{className:"mb-8 text-center",children:[e.jsxs("h1",{className:`mb-4 text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl ${t?"animate-slide-up":""}`,children:["Paiement",e.jsx("span",{className:"block text-emerald-600",children:"Réussi"})]}),e.jsx("p",{className:`mx-auto max-w-2xl text-xl text-slate-600 ${t?"animate-slide-up animation-delay-200":""}`,children:"Votre paiement a été traité avec succès"})]}),e.jsx("div",{className:`mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 ${t?"animate-scale-in animation-delay-400":""}`,children:e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"mb-2 text-sm font-medium tracking-wider text-emerald-700 uppercase",children:"Montant payé"}),e.jsx("p",{className:"text-5xl font-bold text-slate-900 lg:text-6xl",children:n(a?.amount||29.99)}),e.jsxs("div",{className:"mt-4 flex items-center justify-center gap-2",children:[e.jsx("div",{className:"h-2 w-2 animate-pulse rounded-full bg-emerald-500"}),e.jsx("span",{className:"text-sm text-emerald-600",children:"Transaction sécurisée"})]})]})}),e.jsxs("div",{className:"mb-8",children:[e.jsxs("button",{onClick:()=>d(!l),className:"flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100",children:[e.jsx("span",{className:"font-semibold text-slate-800",children:"Détails de la transaction"}),e.jsx(C,{className:`text-slate-600 transition-transform duration-200 ${l?"rotate-90":""}`,size:20})]}),l&&e.jsxs("div",{className:"animate-fade-in mt-4 space-y-4 rounded-xl bg-slate-50 p-6",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Référence"}),e.jsx("span",{className:"font-mono text-slate-900",children:a?.reference||"N/A"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Date"}),e.jsx("span",{className:"text-slate-900",children:j(a?.created_at||new Date)})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Méthode"}),e.jsx("span",{className:"text-slate-900",children:a?.method||"RdCard"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Statut"}),e.jsxs("span",{className:"inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800",children:[e.jsx(c,{size:14,className:"mr-1"}),"Complété"]})]})]})]}),e.jsxs("div",{className:"mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsxs("button",{onClick:()=>window.location.href=k("dashboard"),className:"flex transform items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-slate-800 hover:shadow-lg",children:[e.jsx(S,{size:18}),e.jsx("span",{children:"Accueil"})]}),e.jsxs("button",{onClick:()=>y(a?.reference||""),className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",children:[e.jsx(D,{size:18}),e.jsx("span",{children:x?"Copié!":"Copier"})]}),e.jsxs("button",{onClick:v,className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700",children:[e.jsx(M,{size:18}),e.jsx("span",{children:"Partager"})]}),e.jsxs("button",{onClick:()=>window.print(),className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700",children:[e.jsx(P,{size:18}),e.jsx("span",{children:"Télécharger"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-3",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx(R,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:"Sécurisé"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Paiement 100% sécurisé"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx($,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:"Rapide"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Transaction instantanée"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx(A,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:"Efficace"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Processus optimisé"})]})]})]})})})]}),e.jsx("style",{children:`
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.1); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes slide-up {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes scale-in {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes explode {
                    0% { 
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(var(--size));
                        opacity: 0;
                    }
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                .animate-scale-in {
                    animation: scale-in 0.5s ease-out;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `})]})}export{O as default};

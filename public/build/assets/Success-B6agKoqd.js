import{j as e}from"./vendor-charts-rUnLTv-9.js";import{u as _,a as k,H as z}from"./app-Di9iPLpx.js";import{r as l}from"./vendor-carousel-D-wnt_zG.js";import{s as S}from"./index-ikzcNs2d.js";import{C as d}from"./circle-check-big-B8qvzB5b.js";import{c as C}from"./createLucideIcon-BtoqBj2J.js";import{A as D}from"./arrow-right--RmYoxsT.js";import{H as M}from"./house-DK2QbwQv.js";import{R as L}from"./receipt-BZC8OtZh.js";import{S as $}from"./share-2-r3WqZt2V.js";import{D as A}from"./download-CXzJYb8p.js";import{S as R}from"./shield-BVrF3gSk.js";import{C as F}from"./credit-card-BHsOA9GB.js";import{Z as P}from"./zap-Cr50U_H5.js";/* empty css            */import"./vendor-maps-BwJRj02e.js";const H=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],T=C("Sparkles",H);function ae(){const{t:s,i18n:n}=_(),{props:x}=k(),{payment:t,order:B}=x,[i,p]=l.useState(!1),[u,o]=l.useState(!1),[h,f]=l.useState(!1),[r,b]=l.useState(!1),[j,y]=l.useState([]);l.useEffect(()=>{f(!0),setTimeout(()=>b(!0),300);const a=[...Array(20)].map((m,w)=>({id:w,x:50,y:50,vx:(Math.random()-.5)*15,vy:(Math.random()-.5)*15,size:Math.random()*4+2,opacity:1,color:["#10b981","#3b82f6","#8b5cf6","#ec4899"][Math.floor(Math.random()*4)]}));y(a)},[]);const v=a=>new Date(a).toLocaleDateString(n.resolvedLanguage==="fr"?"fr-FR":"en-US",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),c=a=>new Intl.NumberFormat(n.resolvedLanguage==="fr"?"fr-FR":"en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(a),g=async a=>{try{await navigator.clipboard.writeText(a),o(!0),setTimeout(()=>o(!1),2e3)}catch(m){console.error("Failed to copy:",m)}},N=async()=>{if(navigator.share)try{await navigator.share({title:s("share_payment_title"),text:s("share_payment_text",{amount:c(t?.amount||0)}),url:window.location.href})}catch(a){console.log("Share failed:",a)}};return e.jsxs(e.Fragment,{children:[e.jsx(z,{title:s("payment_successful")}),e.jsxs("div",{className:"relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",children:[e.jsx("div",{className:"absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"}),r&&e.jsx("div",{className:"pointer-events-none absolute inset-0 z-50",children:j.map(a=>e.jsx("div",{className:"absolute h-2 w-2 rounded-full",style:{backgroundColor:a.color,left:"50%",top:"50%",transform:"translate(-50%, -50%)",animation:"explode 1.5s ease-out forwards","--vx":`${a.vx}rem`,"--vy":`${a.vy}rem`,"--size":`${a.size}px`}},a.id))}),e.jsx("div",{className:"relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20",children:e.jsx("div",{className:"mx-auto max-w-4xl",children:e.jsxs("div",{className:`transform rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-1000 sm:p-12 lg:p-16 ${h?"translate-y-0 scale-100 opacity-100":"translate-y-8 scale-95 opacity-0"}`,children:[e.jsx("div",{className:"mb-8 flex justify-center",children:e.jsxs("div",{className:`relative ${r?"animate-bounce-in":""}`,children:[e.jsx("div",{className:"flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl",children:e.jsx(d,{size:48,className:"text-white"})}),r&&e.jsx("div",{className:"absolute inset-0 h-24 w-24 animate-ping rounded-full bg-emerald-400 opacity-30"}),e.jsx(T,{className:"absolute -top-4 -right-4 h-8 w-8 animate-spin text-emerald-400",size:32})]})}),e.jsxs("div",{className:"mb-8 text-center",children:[e.jsx("h1",{className:`mb-4 text-5xl font-bold text-slate-900 sm:text-6xl lg:text-7xl ${r?"animate-slide-up":""}`,children:s("payment_successful")}),e.jsx("p",{className:`mx-auto max-w-2xl text-xl text-slate-600 ${r?"animate-slide-up animation-delay-200":""}`,children:s("payment_processed_successfully")})]}),e.jsx("div",{className:`mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 ${r?"animate-scale-in animation-delay-400":""}`,children:e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"mb-2 text-sm font-medium tracking-wider text-emerald-700 uppercase",children:s("amount_paid")}),e.jsx("p",{className:"text-5xl font-bold text-slate-900 lg:text-6xl",children:c(t?.amount||29.99)}),e.jsxs("div",{className:"mt-4 flex items-center justify-center gap-2",children:[e.jsx("div",{className:"h-2 w-2 animate-pulse rounded-full bg-emerald-500"}),e.jsx("span",{className:"text-sm text-emerald-600",children:s("secure_transaction")})]})]})}),e.jsxs("div",{className:"mb-8",children:[e.jsxs("button",{onClick:()=>p(!i),className:"flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors duration-200 hover:bg-slate-100",children:[e.jsx("span",{className:"font-semibold text-slate-800",children:s("transaction_details")}),e.jsx(D,{className:`text-slate-600 transition-transform duration-200 ${i?"rotate-90":""}`,size:20})]}),i&&e.jsxs("div",{className:"animate-fade-in mt-4 space-y-4 rounded-xl bg-slate-50 p-6",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:s("reference")}),e.jsx("span",{className:"font-mono text-slate-900",children:t?.reference||"N/A"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:s("date")}),e.jsx("span",{className:"text-slate-900",children:v(t?.created_at||new Date)})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:s("payment_method_label")}),e.jsx("span",{className:"text-slate-900",children:t?.method||"RdCard"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:s("status")}),e.jsxs("span",{className:"inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800",children:[e.jsx(d,{size:14,className:"mr-1"}),s("completed")]})]})]})]}),e.jsxs("div",{className:"mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsxs("button",{onClick:()=>window.location.href=S("dashboard"),className:"flex transform items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-slate-800 hover:shadow-lg",children:[e.jsx(M,{size:18}),e.jsx("span",{children:s("dashboard")})]}),e.jsxs("button",{onClick:()=>g(t?.reference||""),className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",children:[e.jsx(L,{size:18}),e.jsx("span",{children:s(u?"copied_short":"copy")})]}),e.jsxs("button",{onClick:N,className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700",children:[e.jsx($,{size:18}),e.jsx("span",{children:s("share")})]}),e.jsxs("button",{onClick:()=>window.print(),className:"flex transform items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700",children:[e.jsx(A,{size:18}),e.jsx("span",{children:s("download")})]})]}),e.jsxs("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-3",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx(R,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:s("secure")}),e.jsx("p",{className:"text-sm text-slate-600",children:s("secure_payment_description")})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx(F,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:s("fast")}),e.jsx("p",{className:"text-sm text-slate-600",children:s("instant_transaction")})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100",children:e.jsx(P,{size:32,className:"text-slate-600"})}),e.jsx("h4",{className:"mb-1 font-semibold text-slate-900",children:s("efficient")}),e.jsx("p",{className:"text-sm text-slate-600",children:s("optimized_process")})]})]})]})})})]}),e.jsx("style",{children:`
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
            `})]})}export{ae as default};

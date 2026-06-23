import{j as r,R as x,c as k,f as ft,L as M}from"./app-BlaVBX9V.js";function dt(t){return r.jsxs("svg",{...t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"}),r.jsx("path",{d:"M9 14h.01"}),r.jsx("path",{d:"M15 14h.01"}),r.jsx("path",{d:"M10 18h4"})]})}function et(t){var e,o,a="";if(typeof t=="string"||typeof t=="number")a+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(e=0;e<s;e++)t[e]&&(o=et(t[e]))&&(a&&(a+=" "),a+=o)}else for(o in t)t[o]&&(a&&(a+=" "),a+=o);return a}function P(){for(var t,e,o=0,a="",s=arguments.length;o<s;o++)(t=arguments[o])&&(e=et(t))&&(a&&(a+=" "),a+=e);return a}var B=t=>typeof t=="number"&&!isNaN(t),D=t=>typeof t=="string",O=t=>typeof t=="function",ut=t=>D(t)||B(t),q=t=>D(t)||O(t)?t:null,mt=(t,e)=>t===!1||B(t)&&t>0?t:e,K=t=>k.isValidElement(t)||D(t)||O(t)||B(t);function pt(t,e,o=300){let{scrollHeight:a,style:s}=t;requestAnimationFrame(()=>{s.minHeight="initial",s.height=a+"px",s.transition=`all ${o}ms`,requestAnimationFrame(()=>{s.height="0",s.padding="0",s.margin="0",setTimeout(e,o)})})}function yt({enter:t,exit:e,appendPosition:o=!1,collapse:a=!0,collapseDuration:s=300}){return function({children:i,position:n,preventExitTransition:f,done:d,nodeRef:p,isIn:y,playToast:m}){let j=o?`${t}--${n}`:t,E=o?`${e}--${n}`:e,L=k.useRef(0);return k.useLayoutEffect(()=>{let T=p.current,v=j.split(" "),h=l=>{l.target===p.current&&(m(),T.removeEventListener("animationend",h),T.removeEventListener("animationcancel",h),L.current===0&&l.type!=="animationcancel"&&T.classList.remove(...v))};T.classList.add(...v),T.addEventListener("animationend",h),T.addEventListener("animationcancel",h)},[]),k.useEffect(()=>{let T=p.current,v=()=>{T.removeEventListener("animationend",v),a?pt(T,d,s):d()};y||(f?v():(L.current=1,T.className+=` ${E}`,T.addEventListener("animationend",v)))},[y]),x.createElement(x.Fragment,null,i)}}function Z(t,e){return{content:ot(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function ot(t,e,o=!1){return k.isValidElement(t)&&!D(t.type)?k.cloneElement(t,{closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):O(t)?t({closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):t}function gt({closeToast:t,theme:e,ariaLabel:o="close"}){return x.createElement("button",{className:`Toastify__close-button Toastify__close-button--${e}`,type:"button",onClick:a=>{a.stopPropagation(),t(!0)},"aria-label":o},x.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},x.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function ht({delay:t,isRunning:e,closeToast:o,type:a="default",hide:s,className:i,controlledProgress:n,progress:f,rtl:d,isIn:p,theme:y}){let m=s||n&&f===0,j={animationDuration:`${t}ms`,animationPlayState:e?"running":"paused"};n&&(j.transform=`scaleX(${f})`);let E=P("Toastify__progress-bar",n?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${y}`,`Toastify__progress-bar--${a}`,{"Toastify__progress-bar--rtl":d}),L=O(i)?i({rtl:d,type:a,defaultClassName:E}):P(E,i),T={[n&&f>=1?"onTransitionEnd":"onAnimationEnd"]:n&&f<1?null:()=>{p&&o()}};return x.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":m},x.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${y} Toastify__progress-bar--${a}`}),x.createElement("div",{role:"progressbar","aria-hidden":m?"true":"false","aria-label":"notification timer","aria-valuenow":n?Math.round(f*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:L,style:j,...T}))}var _t=1,at=()=>`${_t++}`;function vt(t,e,o){let a=1,s=0,i=[],n=[],f=e,d=new Map,p=new Set,y=l=>(p.add(l),()=>p.delete(l)),m=()=>{n=Array.from(d.values()),p.forEach(l=>l())},j=({containerId:l,toastId:c,updateId:u})=>{let w=l?l!==t:t!==1,N=d.has(c)&&u==null;return w||N},E=(l,c)=>{d.forEach(u=>{var w;(c==null||c===u.props.toastId)&&((w=u.toggle)==null||w.call(u,l))})},L=l=>{var c,u;l.isActive&&((u=(c=l.props)==null?void 0:c.onClose)==null||u.call(c,l.removalReason),l.isActive=!1,o(Z(l,"removed")))},T=l=>{if(l==null)d.forEach(L);else{let c=d.get(l);c&&L(c)}m()},v=()=>{s-=i.length,i=[]},h=l=>{var c,u;let{toastId:w,updateId:N}=l.props,g=N==null;l.staleId&&d.delete(l.staleId),l.isActive=!0,d.set(w,l),m(),o(Z(l,g?"added":"updated")),g&&((u=(c=l.props).onOpen)==null||u.call(c))};return{id:t,props:f,observe:y,toggle:E,removeToast:T,toasts:d,clearQueue:v,buildToast:(l,c)=>{if(j(c))return;let{toastId:u,updateId:w,data:N,staleId:g,delay:b}=c,C=w==null;C&&s++;let z={...f,style:f.toastStyle,key:a++,...Object.fromEntries(Object.entries(c).filter(([H,$])=>$!=null)),toastId:u,updateId:w,data:N,isIn:!1,className:q(c.className||f.toastClassName),progressClassName:q(c.progressClassName||f.progressClassName),autoClose:c.isLoading?!1:mt(c.autoClose,f.autoClose),closeToast(H){let $=d.get(u);$&&($.removalReason=H,T(u))},deleteToast(){if(d.get(u)!=null){if(d.delete(u),s--,s<0&&(s=0),i.length>0){h(i.shift());return}m()}}};z.closeButton=f.closeButton,c.closeButton===!1||K(c.closeButton)?z.closeButton=c.closeButton:c.closeButton===!0&&(z.closeButton=K(f.closeButton)?f.closeButton:!0);let A={content:l,props:z,staleId:g};f.limit&&f.limit>0&&s>f.limit&&C?i.push(A):B(b)?setTimeout(()=>{h(A)},b):h(A)},setProps(l){f=l},setToggle:(l,c)=>{let u=d.get(l);u&&(u.toggle=c)},isToastActive:l=>{var c;return(c=d.get(l))==null?void 0:c.isActive},getSnapshot:()=>n}}var I=new Map,R=[],Y=new Set,bt=t=>Y.forEach(e=>e(t)),rt=()=>I.size>0;function xt(){R.forEach(t=>nt(t.content,t.options)),R=[]}var Tt=(t,{containerId:e})=>{var o;return(o=I.get(e||1))==null?void 0:o.toasts.get(t)};function st(t,e){var o;if(e)return!!((o=I.get(e))!=null&&o.isToastActive(t));let a=!1;return I.forEach(s=>{s.isToastActive(t)&&(a=!0)}),a}function kt(t){if(!rt()){R=R.filter(e=>t!=null&&e.options.toastId!==t);return}if(t==null||ut(t))I.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=I.get(t.containerId);e?e.removeToast(t.id):I.forEach(o=>{o.removeToast(t.id)})}}var wt=(t={})=>{I.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})};function nt(t,e){K(t)&&(rt()||R.push({content:t,options:e}),I.forEach(o=>{o.buildToast(t,e)}))}function Et(t){var e;(e=I.get(t.containerId||1))==null||e.setToggle(t.id,t.fn)}function it(t,e){I.forEach(o=>{(e==null||!(e!=null&&e.containerId)||e?.containerId===o.id)&&o.toggle(t,e?.id)})}function jt(t){let e=t.containerId||1;return{subscribe(o){let a=vt(e,t,bt);I.set(e,a);let s=a.observe(o);return xt(),()=>{s(),I.delete(e)}},setProps(o){var a;(a=I.get(e))==null||a.setProps(o)},getSnapshot(){var o;return(o=I.get(e))==null?void 0:o.getSnapshot()}}}function It(t){return Y.add(t),()=>{Y.delete(t)}}function Lt(t){return t&&(D(t.toastId)||B(t.toastId))?t.toastId:at()}function S(t,e){return nt(t,e),e.toastId}function W(t,e){return{...e,type:e&&e.type||t,toastId:Lt(e)}}function X(t){return(e,o)=>S(e,W(t,o))}function _(t,e){return S(t,W("default",e))}_.loading=(t,e)=>S(t,W("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e}));function Nt(t,{pending:e,error:o,success:a},s){let i;e&&(i=D(e)?_.loading(e,s):_.loading(e.render,{...s,...e}));let n={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},f=(p,y,m)=>{if(y==null){_.dismiss(i);return}let j={type:p,...n,...s,data:m},E=D(y)?{render:y}:y;return i?_.update(i,{...j,...E}):_(E.render,{...j,...E}),m},d=O(t)?t():t;return d.then(p=>f("success",a,p)).catch(p=>f("error",o,p)),d}_.promise=Nt;_.success=X("success");_.info=X("info");_.error=X("error");_.warning=X("warning");_.warn=_.warning;_.dark=(t,e)=>S(t,W("default",{theme:"dark",...e}));function Ct(t){kt(t)}_.dismiss=Ct;_.clearWaitingQueue=wt;_.isActive=st;_.update=(t,e={})=>{let o=Tt(t,e);if(o){let{props:a,content:s}=o,i={delay:100,...a,...e,toastId:e.toastId||t,updateId:at()};i.toastId!==t&&(i.staleId=t);let n=i.render||s;delete i.render,S(n,i)}};_.done=t=>{_.update(t,{progress:1})};_.onChange=It;_.play=t=>it(!0,t);_.pause=t=>it(!1,t);function Mt(t){var e;let{subscribe:o,getSnapshot:a,setProps:s}=k.useRef(jt(t)).current;s(t);let i=(e=k.useSyncExternalStore(o,a,a))==null?void 0:e.slice();function n(f){if(!i)return[];let d=new Map;return t.newestOnTop&&i.reverse(),i.forEach(p=>{let{position:y}=p.props;d.has(y)||d.set(y,[]),d.get(y).push(p)}),Array.from(d,p=>f(p[0],p[1]))}return{getToastToRender:n,isToastActive:st,count:i?.length}}function zt(t){let[e,o]=k.useState(!1),[a,s]=k.useState(!1),i=k.useRef(null),n=k.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:f,pauseOnHover:d,closeToast:p,onClick:y,closeOnClick:m}=t;Et({id:t.toastId,containerId:t.containerId,fn:o}),k.useEffect(()=>{if(t.pauseOnFocusLoss)return j(),()=>{E()}},[t.pauseOnFocusLoss]);function j(){document.hasFocus()||h(),window.addEventListener("focus",v),window.addEventListener("blur",h)}function E(){window.removeEventListener("focus",v),window.removeEventListener("blur",h)}function L(g){if(t.draggable===!0||t.draggable===g.pointerType){l();let b=i.current;n.canCloseOnClick=!0,n.canDrag=!0,b.style.transition="none",t.draggableDirection==="x"?(n.start=g.clientX,n.removalDistance=b.offsetWidth*(t.draggablePercent/100)):(n.start=g.clientY,n.removalDistance=b.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function T(g){let{top:b,bottom:C,left:z,right:A}=i.current.getBoundingClientRect();g.pointerType==="mouse"&&t.pauseOnHover&&g.clientX>=z&&g.clientX<=A&&g.clientY>=b&&g.clientY<=C?h():v()}function v(){o(!0)}function h(){o(!1)}function l(){n.didMove=!1,document.addEventListener("pointermove",u),document.addEventListener("pointerup",w)}function c(){document.removeEventListener("pointermove",u),document.removeEventListener("pointerup",w)}function u(g){let b=i.current;if(n.canDrag&&b){n.didMove=!0,e&&h(),t.draggableDirection==="x"?n.delta=g.clientX-n.start:n.delta=g.clientY-n.start,n.start!==g.clientX&&(n.canCloseOnClick=!1);let C=t.draggableDirection==="x"?`${n.delta}px, var(--y)`:`0, calc(${n.delta}px + var(--y))`;b.style.transform=`translate3d(${C},0)`,b.style.opacity=`${1-Math.abs(n.delta/n.removalDistance)}`}}function w(){c();let g=i.current;if(n.canDrag&&n.didMove&&g){if(n.canDrag=!1,Math.abs(n.delta)>n.removalDistance){s(!0),t.closeToast(!0),t.collapseAll();return}g.style.transition="transform 0.2s, opacity 0.2s",g.style.removeProperty("transform"),g.style.removeProperty("opacity")}}let N={onPointerDown:L,onPointerUp:T};return f&&d&&(N.onMouseEnter=h,t.stacked||(N.onMouseLeave=v)),m&&(N.onClick=g=>{y&&y(g),n.canCloseOnClick&&p(!0)}),{playToast:v,pauseToast:h,isRunning:e,preventExitTransition:a,toastRef:i,eventHandlers:N}}var lt=typeof window<"u"?k.useLayoutEffect:k.useEffect,U=({theme:t,type:e,isLoading:o,...a})=>x.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${e})`,...a});function At(t){return x.createElement(U,{...t},x.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function Ot(t){return x.createElement(U,{...t},x.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function $t(t){return x.createElement(U,{...t},x.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function Pt(t){return x.createElement(U,{...t},x.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function Dt(){return x.createElement("div",{className:"Toastify__spinner"})}var G={info:Ot,warning:At,success:$t,error:Pt,spinner:Dt},Rt=t=>t in G;function Bt({theme:t,type:e,isLoading:o,icon:a}){let s=null,i={theme:t,type:e};return a===!1||(O(a)?s=a({...i,isLoading:o}):k.isValidElement(a)?s=k.cloneElement(a,i):o?s=G.spinner():Rt(e)&&(s=G[e](i))),s}var St=t=>{let{isRunning:e,preventExitTransition:o,toastRef:a,eventHandlers:s,playToast:i}=zt(t),{closeButton:n,children:f,autoClose:d,onClick:p,type:y,hideProgressBar:m,closeToast:j,transition:E,position:L,className:T,style:v,progressClassName:h,updateId:l,role:c,progress:u,rtl:w,toastId:N,deleteToast:g,isIn:b,isLoading:C,closeOnClick:z,theme:A,ariaLabel:H}=t,$=P("Toastify__toast",`Toastify__toast-theme--${A}`,`Toastify__toast--${y}`,{"Toastify__toast--rtl":w},{"Toastify__toast--close-on-click":z}),ct=O(T)?T({rtl:w,position:L,type:y,defaultClassName:$}):P($,T),Q=Bt(t),J=!!u||!d,F={closeToast:j,type:y,theme:A},V=null;return n===!1||(O(n)?V=n(F):k.isValidElement(n)?V=k.cloneElement(n,F):V=gt(F)),x.createElement(E,{isIn:b,done:g,position:L,preventExitTransition:o,nodeRef:a,playToast:i},x.createElement("div",{id:N,tabIndex:0,onClick:p,"data-in":b,className:ct,...s,style:v,ref:a,...b&&{role:c,"aria-label":H}},Q!=null&&x.createElement("div",{className:P("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!C})},Q),ot(f,t,!e),V,!t.customProgressBar&&x.createElement(ht,{...l&&!J?{key:`p-${l}`}:{},rtl:w,theme:A,delay:d,isRunning:e,isIn:b,closeToast:j,hide:m,type:y,className:h,controlledProgress:J,progress:u||0})))},Ht=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),Vt=yt(Ht("bounce",!0)),Wt={position:"top-right",transition:Vt,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function Xt(t){let e={...Wt,...t},o=t.stacked,[a,s]=k.useState(!0),i=k.useRef(null),{getToastToRender:n,isToastActive:f,count:d}=Mt(e),{className:p,style:y,rtl:m,containerId:j,hotKeys:E}=e;function L(v){let h=P("Toastify__toast-container",`Toastify__toast-container--${v}`,{"Toastify__toast-container--rtl":m});return O(p)?p({position:v,rtl:m,defaultClassName:h}):P(h,q(p))}function T(){o&&(s(!0),_.play())}return lt(()=>{var v;if(o){let h=i.current.querySelectorAll('[data-in="true"]'),l=12,c=(v=e.position)==null?void 0:v.includes("top"),u=0,w=0;Array.from(h).reverse().forEach((N,g)=>{let b=N;b.classList.add("Toastify__toast--stacked"),g>0&&(b.dataset.collapsed=`${a}`),b.dataset.pos||(b.dataset.pos=c?"top":"bot");let C=u*(a?.2:1)+(a?0:l*g),z=Math.max(.5,1-(a?w:0));b.style.setProperty("--y",`${c?C:C*-1}px`),b.style.setProperty("--g",`${l}`),b.style.setProperty("--s",`${z}`),u+=b.offsetHeight,w+=.025})}},[a,d,o]),k.useEffect(()=>{function v(h){var l;let c=i.current;E(h)&&((l=c?.querySelector('[tabIndex="0"]'))==null||l.focus(),s(!1),_.pause()),h.key==="Escape"&&(document.activeElement===c||c!=null&&c.contains(document.activeElement))&&(s(!0),_.play())}return document.addEventListener("keydown",v),()=>{document.removeEventListener("keydown",v)}},[E]),x.createElement("section",{ref:i,className:"Toastify",id:j,onMouseEnter:()=>{o&&(s(!1),_.pause())},onMouseLeave:T,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":e["aria-label"]},n((v,h)=>{let l=h.length?{...y}:{...y,pointerEvents:"none"};return x.createElement("div",{tabIndex:-1,className:L(v),"data-stacked":o,style:l,key:`c-${v}`},h.map(({content:c,props:u})=>x.createElement(St,{...u,stacked:o,collapseAll:T,isIn:f(u.toastId,u.containerId),key:`t-${u.key}`},c)))}))}var Ut=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,tt=new Map,Ft=(t,e)=>{lt(()=>{if(typeof document>"u")return;let o=document,a=tt.get(o);if(a){e&&a.setAttribute("nonce",e);return}let s=o.createElement("style");s.textContent=t,e&&s.setAttribute("nonce",e),o.head.appendChild(s),tt.set(o,s)},[e])};function qt(t){return Ft(Ut,t.nonce),x.createElement(Xt,{...t})}function Yt({header:t,children:e}){const{props:o}=ft(),{user:a,activeGroupId:s}=o.auth,i=o.flash||{},[n,f]=k.useState(!1);k.useEffect(()=>{i.success&&_.success(i.success),i.error&&_.error(i.error)},[i.success,i.error]);const d=[{name:"Dashboard",href:route("dashboard"),active:route().current("dashboard"),icon:r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"})})},{name:"Auditoría IA",href:route("audit.index"),active:route().current("audit.*"),icon:r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"})})},{name:"Mis Grupos",href:route("groups.index"),active:route().current("groups.*"),icon:r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})})}],p=[{name:"Panel de Control",href:route("dashboard"),active:route().current("dashboard"),icon:r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})},{name:"Mis Grupos",href:route("groups.index"),active:route().current("groups.*"),icon:r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})})}],y=a.role==="docente"?d:p;return r.jsxs("div",{className:"flex h-screen bg-gray-50 text-gray-800 overflow-hidden font-sans",children:[r.jsx(qt,{position:"bottom-right",theme:"colored"}),r.jsxs("aside",{className:"hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-20",children:[r.jsxs("div",{className:"p-6 flex items-center space-x-3 border-b border-gray-100",children:[r.jsx(M,{href:"/",children:r.jsx(dt,{className:"block h-8 w-auto text-indigo-600"})}),r.jsx("span",{className:"font-extrabold text-lg tracking-wide text-gray-900",children:"Agentes Taller"})]}),r.jsxs("nav",{className:"flex-1 px-4 py-6 space-y-2 overflow-y-auto",children:[y.map(m=>r.jsxs(M,{href:m.href,className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${m.active?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[m.icon,m.name]},m.name)),a.role==="alumno"&&s&&r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"pt-6 pb-2",children:r.jsx("p",{className:"px-4 text-xs font-bold text-gray-400 uppercase tracking-wider",children:"Agilidad (Equipo)"})}),r.jsxs(M,{href:route("agile.backlog",s),className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current("agile.backlog")?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})}),"Backlog"]}),r.jsxs(M,{href:route("agile.dailys",s),className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current("agile.dailys")?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[r.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),"Dailys"]})]})]}),r.jsxs("div",{className:"p-4 border-t border-gray-200 bg-gray-50/50",children:[r.jsxs("div",{className:"mb-4 px-4 flex items-center gap-3",children:[r.jsx("div",{className:"w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm",children:a.name.charAt(0)}),r.jsxs("div",{className:"overflow-hidden",children:[r.jsx("p",{className:"text-sm font-bold text-gray-900 truncate",children:a.name}),r.jsx("p",{className:"text-xs text-gray-500 truncate",children:a.email})]})]}),r.jsxs("div",{className:"flex gap-2",children:[r.jsx(M,{href:route("profile.edit"),className:"flex-1 text-center px-3 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm",children:"Perfil"}),r.jsx(M,{href:route("logout"),method:"post",as:"button",className:"flex-1 text-center px-3 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm",children:"Salir"})]})]})]}),r.jsxs("div",{className:"md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 flex justify-between items-center p-4 shadow-sm",children:[r.jsx("span",{className:"font-bold text-indigo-600",children:"Agentes Taller"}),r.jsx("button",{onClick:()=>f(!n),className:"p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none",children:r.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:n?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"})})})]}),n&&r.jsx("div",{className:"md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex",onClick:()=>f(!1),children:r.jsxs("div",{className:"w-64 h-full bg-white flex flex-col shadow-2xl",onClick:m=>m.stopPropagation(),children:[r.jsxs("div",{className:"p-6 border-b border-gray-100 flex justify-between items-center",children:[r.jsx("span",{className:"font-extrabold text-lg text-indigo-600",children:"Menú"}),r.jsx("button",{onClick:()=>f(!1),className:"text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100",children:"✕"})]}),r.jsxs("nav",{className:"flex-1 p-4 space-y-2 overflow-y-auto",children:[y.map(m=>r.jsxs(M,{href:m.href,className:`flex items-center px-4 py-3 rounded-xl ${m.active?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:[m.icon,m.name]},m.name)),a.role==="alumno"&&s&&r.jsxs(r.Fragment,{children:[r.jsx("hr",{className:"my-4 border-gray-100"}),r.jsx(M,{href:route("agile.backlog",s),className:`flex items-center px-4 py-3 rounded-xl ${route().current("agile.backlog")?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:"📋 Backlog"}),r.jsx(M,{href:route("agile.dailys",s),className:`flex items-center px-4 py-3 rounded-xl ${route().current("agile.dailys")?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:"📅 Dailys"})]})]}),r.jsxs("div",{className:"p-4 border-t border-gray-100",children:[r.jsx(M,{href:route("profile.edit"),className:"block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 mb-2",children:"Perfil"}),r.jsx(M,{href:route("logout"),method:"post",as:"button",className:"w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-bold",children:"Cerrar Sesión"})]})]})}),r.jsxs("div",{className:"flex-1 flex flex-col overflow-y-auto w-full pt-16 md:pt-0 bg-gray-50/50",children:[t&&r.jsx("header",{className:"px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full",children:t}),r.jsx("main",{className:"px-4 sm:px-8 pb-12 max-w-7xl mx-auto w-full flex-1",children:e})]})]})}export{Yt as A,P as c};

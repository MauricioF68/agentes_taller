import{j as a,R as b,c as k,f as dt,L as C}from"./app-BzopRQ8r.js";function ft(t){return a.jsxs("svg",{...t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[a.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"}),a.jsx("path",{d:"M9 14h.01"}),a.jsx("path",{d:"M15 14h.01"}),a.jsx("path",{d:"M10 18h4"})]})}function et(t){var e,o,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var s=t.length;for(e=0;e<s;e++)t[e]&&(o=et(t[e]))&&(r&&(r+=" "),r+=o)}else for(o in t)t[o]&&(r&&(r+=" "),r+=o);return r}function P(){for(var t,e,o=0,r="",s=arguments.length;o<s;o++)(t=arguments[o])&&(e=et(t))&&(r&&(r+=" "),r+=e);return r}var R=t=>typeof t=="number"&&!isNaN(t),D=t=>typeof t=="string",$=t=>typeof t=="function",ut=t=>D(t)||R(t),q=t=>D(t)||$(t)?t:null,mt=(t,e)=>t===!1||R(t)&&t>0?t:e,K=t=>k.isValidElement(t)||D(t)||$(t)||R(t);function pt(t,e,o=300){let{scrollHeight:r,style:s}=t;requestAnimationFrame(()=>{s.minHeight="initial",s.height=r+"px",s.transition=`all ${o}ms`,requestAnimationFrame(()=>{s.height="0",s.padding="0",s.margin="0",setTimeout(e,o)})})}function yt({enter:t,exit:e,appendPosition:o=!1,collapse:r=!0,collapseDuration:s=300}){return function({children:i,position:n,preventExitTransition:d,done:f,nodeRef:p,isIn:y,playToast:m}){let E=o?`${t}--${n}`:t,j=o?`${e}--${n}`:e,I=k.useRef(0);return k.useLayoutEffect(()=>{let T=p.current,v=E.split(" "),h=l=>{l.target===p.current&&(m(),T.removeEventListener("animationend",h),T.removeEventListener("animationcancel",h),I.current===0&&l.type!=="animationcancel"&&T.classList.remove(...v))};T.classList.add(...v),T.addEventListener("animationend",h),T.addEventListener("animationcancel",h)},[]),k.useEffect(()=>{let T=p.current,v=()=>{T.removeEventListener("animationend",v),r?pt(T,f,s):f()};y||(d?v():(I.current=1,T.className+=` ${j}`,T.addEventListener("animationend",v)))},[y]),b.createElement(b.Fragment,null,i)}}function Z(t,e){return{content:ot(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function ot(t,e,o=!1){return k.isValidElement(t)&&!D(t.type)?k.cloneElement(t,{closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):$(t)?t({closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):t}function gt({closeToast:t,theme:e,ariaLabel:o="close"}){return b.createElement("button",{className:`Toastify__close-button Toastify__close-button--${e}`,type:"button",onClick:r=>{r.stopPropagation(),t(!0)},"aria-label":o},b.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},b.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function ht({delay:t,isRunning:e,closeToast:o,type:r="default",hide:s,className:i,controlledProgress:n,progress:d,rtl:f,isIn:p,theme:y}){let m=s||n&&d===0,E={animationDuration:`${t}ms`,animationPlayState:e?"running":"paused"};n&&(E.transform=`scaleX(${d})`);let j=P("Toastify__progress-bar",n?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${y}`,`Toastify__progress-bar--${r}`,{"Toastify__progress-bar--rtl":f}),I=$(i)?i({rtl:f,type:r,defaultClassName:j}):P(j,i),T={[n&&d>=1?"onTransitionEnd":"onAnimationEnd"]:n&&d<1?null:()=>{p&&o()}};return b.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":m},b.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${y} Toastify__progress-bar--${r}`}),b.createElement("div",{role:"progressbar","aria-hidden":m?"true":"false","aria-label":"notification timer","aria-valuenow":n?Math.round(d*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:I,style:E,...T}))}var xt=1,at=()=>`${xt++}`;function vt(t,e,o){let r=1,s=0,i=[],n=[],d=e,f=new Map,p=new Set,y=l=>(p.add(l),()=>p.delete(l)),m=()=>{n=Array.from(f.values()),p.forEach(l=>l())},E=({containerId:l,toastId:c,updateId:u})=>{let w=l?l!==t:t!==1,L=f.has(c)&&u==null;return w||L},j=(l,c)=>{f.forEach(u=>{var w;(c==null||c===u.props.toastId)&&((w=u.toggle)==null||w.call(u,l))})},I=l=>{var c,u;l.isActive&&((u=(c=l.props)==null?void 0:c.onClose)==null||u.call(c,l.removalReason),l.isActive=!1,o(Z(l,"removed")))},T=l=>{if(l==null)f.forEach(I);else{let c=f.get(l);c&&I(c)}m()},v=()=>{s-=i.length,i=[]},h=l=>{var c,u;let{toastId:w,updateId:L}=l.props,g=L==null;l.staleId&&f.delete(l.staleId),l.isActive=!0,f.set(w,l),m(),o(Z(l,g?"added":"updated")),g&&((u=(c=l.props).onOpen)==null||u.call(c))};return{id:t,props:d,observe:y,toggle:j,removeToast:T,toasts:f,clearQueue:v,buildToast:(l,c)=>{if(E(c))return;let{toastId:u,updateId:w,data:L,staleId:g,delay:_}=c,M=w==null;M&&s++;let z={...d,style:d.toastStyle,key:r++,...Object.fromEntries(Object.entries(c).filter(([H,O])=>O!=null)),toastId:u,updateId:w,data:L,isIn:!1,className:q(c.className||d.toastClassName),progressClassName:q(c.progressClassName||d.progressClassName),autoClose:c.isLoading?!1:mt(c.autoClose,d.autoClose),closeToast(H){let O=f.get(u);O&&(O.removalReason=H,T(u))},deleteToast(){if(f.get(u)!=null){if(f.delete(u),s--,s<0&&(s=0),i.length>0){h(i.shift());return}m()}}};z.closeButton=d.closeButton,c.closeButton===!1||K(c.closeButton)?z.closeButton=c.closeButton:c.closeButton===!0&&(z.closeButton=K(d.closeButton)?d.closeButton:!0);let A={content:l,props:z,staleId:g};d.limit&&d.limit>0&&s>d.limit&&M?i.push(A):R(_)?setTimeout(()=>{h(A)},_):h(A)},setProps(l){d=l},setToggle:(l,c)=>{let u=f.get(l);u&&(u.toggle=c)},isToastActive:l=>{var c;return(c=f.get(l))==null?void 0:c.isActive},getSnapshot:()=>n}}var N=new Map,B=[],Y=new Set,_t=t=>Y.forEach(e=>e(t)),rt=()=>N.size>0;function bt(){B.forEach(t=>nt(t.content,t.options)),B=[]}var Tt=(t,{containerId:e})=>{var o;return(o=N.get(e||1))==null?void 0:o.toasts.get(t)};function st(t,e){var o;if(e)return!!((o=N.get(e))!=null&&o.isToastActive(t));let r=!1;return N.forEach(s=>{s.isToastActive(t)&&(r=!0)}),r}function kt(t){if(!rt()){B=B.filter(e=>t!=null&&e.options.toastId!==t);return}if(t==null||ut(t))N.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=N.get(t.containerId);e?e.removeToast(t.id):N.forEach(o=>{o.removeToast(t.id)})}}var wt=(t={})=>{N.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})};function nt(t,e){K(t)&&(rt()||B.push({content:t,options:e}),N.forEach(o=>{o.buildToast(t,e)}))}function jt(t){var e;(e=N.get(t.containerId||1))==null||e.setToggle(t.id,t.fn)}function it(t,e){N.forEach(o=>{(e==null||!(e!=null&&e.containerId)||e?.containerId===o.id)&&o.toggle(t,e?.id)})}function Et(t){let e=t.containerId||1;return{subscribe(o){let r=vt(e,t,_t);N.set(e,r);let s=r.observe(o);return bt(),()=>{s(),N.delete(e)}},setProps(o){var r;(r=N.get(e))==null||r.setProps(o)},getSnapshot(){var o;return(o=N.get(e))==null?void 0:o.getSnapshot()}}}function Nt(t){return Y.add(t),()=>{Y.delete(t)}}function It(t){return t&&(D(t.toastId)||R(t.toastId))?t.toastId:at()}function S(t,e){return nt(t,e),e.toastId}function W(t,e){return{...e,type:e&&e.type||t,toastId:It(e)}}function X(t){return(e,o)=>S(e,W(t,o))}function x(t,e){return S(t,W("default",e))}x.loading=(t,e)=>S(t,W("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e}));function Lt(t,{pending:e,error:o,success:r},s){let i;e&&(i=D(e)?x.loading(e,s):x.loading(e.render,{...s,...e}));let n={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},d=(p,y,m)=>{if(y==null){x.dismiss(i);return}let E={type:p,...n,...s,data:m},j=D(y)?{render:y}:y;return i?x.update(i,{...E,...j}):x(j.render,{...E,...j}),m},f=$(t)?t():t;return f.then(p=>d("success",r,p)).catch(p=>d("error",o,p)),f}x.promise=Lt;x.success=X("success");x.info=X("info");x.error=X("error");x.warning=X("warning");x.warn=x.warning;x.dark=(t,e)=>S(t,W("default",{theme:"dark",...e}));function Ct(t){kt(t)}x.dismiss=Ct;x.clearWaitingQueue=wt;x.isActive=st;x.update=(t,e={})=>{let o=Tt(t,e);if(o){let{props:r,content:s}=o,i={delay:100,...r,...e,toastId:e.toastId||t,updateId:at()};i.toastId!==t&&(i.staleId=t);let n=i.render||s;delete i.render,S(n,i)}};x.done=t=>{x.update(t,{progress:1})};x.onChange=Nt;x.play=t=>it(!0,t);x.pause=t=>it(!1,t);function Mt(t){var e;let{subscribe:o,getSnapshot:r,setProps:s}=k.useRef(Et(t)).current;s(t);let i=(e=k.useSyncExternalStore(o,r,r))==null?void 0:e.slice();function n(d){if(!i)return[];let f=new Map;return t.newestOnTop&&i.reverse(),i.forEach(p=>{let{position:y}=p.props;f.has(y)||f.set(y,[]),f.get(y).push(p)}),Array.from(f,p=>d(p[0],p[1]))}return{getToastToRender:n,isToastActive:st,count:i?.length}}function zt(t){let[e,o]=k.useState(!1),[r,s]=k.useState(!1),i=k.useRef(null),n=k.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:d,pauseOnHover:f,closeToast:p,onClick:y,closeOnClick:m}=t;jt({id:t.toastId,containerId:t.containerId,fn:o}),k.useEffect(()=>{if(t.pauseOnFocusLoss)return E(),()=>{j()}},[t.pauseOnFocusLoss]);function E(){document.hasFocus()||h(),window.addEventListener("focus",v),window.addEventListener("blur",h)}function j(){window.removeEventListener("focus",v),window.removeEventListener("blur",h)}function I(g){if(t.draggable===!0||t.draggable===g.pointerType){l();let _=i.current;n.canCloseOnClick=!0,n.canDrag=!0,_.style.transition="none",t.draggableDirection==="x"?(n.start=g.clientX,n.removalDistance=_.offsetWidth*(t.draggablePercent/100)):(n.start=g.clientY,n.removalDistance=_.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function T(g){let{top:_,bottom:M,left:z,right:A}=i.current.getBoundingClientRect();g.pointerType==="mouse"&&t.pauseOnHover&&g.clientX>=z&&g.clientX<=A&&g.clientY>=_&&g.clientY<=M?h():v()}function v(){o(!0)}function h(){o(!1)}function l(){n.didMove=!1,document.addEventListener("pointermove",u),document.addEventListener("pointerup",w)}function c(){document.removeEventListener("pointermove",u),document.removeEventListener("pointerup",w)}function u(g){let _=i.current;if(n.canDrag&&_){n.didMove=!0,e&&h(),t.draggableDirection==="x"?n.delta=g.clientX-n.start:n.delta=g.clientY-n.start,n.start!==g.clientX&&(n.canCloseOnClick=!1);let M=t.draggableDirection==="x"?`${n.delta}px, var(--y)`:`0, calc(${n.delta}px + var(--y))`;_.style.transform=`translate3d(${M},0)`,_.style.opacity=`${1-Math.abs(n.delta/n.removalDistance)}`}}function w(){c();let g=i.current;if(n.canDrag&&n.didMove&&g){if(n.canDrag=!1,Math.abs(n.delta)>n.removalDistance){s(!0),t.closeToast(!0),t.collapseAll();return}g.style.transition="transform 0.2s, opacity 0.2s",g.style.removeProperty("transform"),g.style.removeProperty("opacity")}}let L={onPointerDown:I,onPointerUp:T};return d&&f&&(L.onMouseEnter=h,t.stacked||(L.onMouseLeave=v)),m&&(L.onClick=g=>{y&&y(g),n.canCloseOnClick&&p(!0)}),{playToast:v,pauseToast:h,isRunning:e,preventExitTransition:r,toastRef:i,eventHandlers:L}}var lt=typeof window<"u"?k.useLayoutEffect:k.useEffect,U=({theme:t,type:e,isLoading:o,...r})=>b.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${e})`,...r});function At(t){return b.createElement(U,{...t},b.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function $t(t){return b.createElement(U,{...t},b.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function Ot(t){return b.createElement(U,{...t},b.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function Pt(t){return b.createElement(U,{...t},b.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function Dt(){return b.createElement("div",{className:"Toastify__spinner"})}var G={info:$t,warning:At,success:Ot,error:Pt,spinner:Dt},Bt=t=>t in G;function Rt({theme:t,type:e,isLoading:o,icon:r}){let s=null,i={theme:t,type:e};return r===!1||($(r)?s=r({...i,isLoading:o}):k.isValidElement(r)?s=k.cloneElement(r,i):o?s=G.spinner():Bt(e)&&(s=G[e](i))),s}var St=t=>{let{isRunning:e,preventExitTransition:o,toastRef:r,eventHandlers:s,playToast:i}=zt(t),{closeButton:n,children:d,autoClose:f,onClick:p,type:y,hideProgressBar:m,closeToast:E,transition:j,position:I,className:T,style:v,progressClassName:h,updateId:l,role:c,progress:u,rtl:w,toastId:L,deleteToast:g,isIn:_,isLoading:M,closeOnClick:z,theme:A,ariaLabel:H}=t,O=P("Toastify__toast",`Toastify__toast-theme--${A}`,`Toastify__toast--${y}`,{"Toastify__toast--rtl":w},{"Toastify__toast--close-on-click":z}),ct=$(T)?T({rtl:w,position:I,type:y,defaultClassName:O}):P(O,T),Q=Rt(t),J=!!u||!f,F={closeToast:E,type:y,theme:A},V=null;return n===!1||($(n)?V=n(F):k.isValidElement(n)?V=k.cloneElement(n,F):V=gt(F)),b.createElement(j,{isIn:_,done:g,position:I,preventExitTransition:o,nodeRef:r,playToast:i},b.createElement("div",{id:L,tabIndex:0,onClick:p,"data-in":_,className:ct,...s,style:v,ref:r,..._&&{role:c,"aria-label":H}},Q!=null&&b.createElement("div",{className:P("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!M})},Q),ot(d,t,!e),V,!t.customProgressBar&&b.createElement(ht,{...l&&!J?{key:`p-${l}`}:{},rtl:w,theme:A,delay:f,isRunning:e,isIn:_,closeToast:E,hide:m,type:y,className:h,controlledProgress:J,progress:u||0})))},Ht=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),Vt=yt(Ht("bounce",!0)),Wt={position:"top-right",transition:Vt,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function Xt(t){let e={...Wt,...t},o=t.stacked,[r,s]=k.useState(!0),i=k.useRef(null),{getToastToRender:n,isToastActive:d,count:f}=Mt(e),{className:p,style:y,rtl:m,containerId:E,hotKeys:j}=e;function I(v){let h=P("Toastify__toast-container",`Toastify__toast-container--${v}`,{"Toastify__toast-container--rtl":m});return $(p)?p({position:v,rtl:m,defaultClassName:h}):P(h,q(p))}function T(){o&&(s(!0),x.play())}return lt(()=>{var v;if(o){let h=i.current.querySelectorAll('[data-in="true"]'),l=12,c=(v=e.position)==null?void 0:v.includes("top"),u=0,w=0;Array.from(h).reverse().forEach((L,g)=>{let _=L;_.classList.add("Toastify__toast--stacked"),g>0&&(_.dataset.collapsed=`${r}`),_.dataset.pos||(_.dataset.pos=c?"top":"bot");let M=u*(r?.2:1)+(r?0:l*g),z=Math.max(.5,1-(r?w:0));_.style.setProperty("--y",`${c?M:M*-1}px`),_.style.setProperty("--g",`${l}`),_.style.setProperty("--s",`${z}`),u+=_.offsetHeight,w+=.025})}},[r,f,o]),k.useEffect(()=>{function v(h){var l;let c=i.current;j(h)&&((l=c?.querySelector('[tabIndex="0"]'))==null||l.focus(),s(!1),x.pause()),h.key==="Escape"&&(document.activeElement===c||c!=null&&c.contains(document.activeElement))&&(s(!0),x.play())}return document.addEventListener("keydown",v),()=>{document.removeEventListener("keydown",v)}},[j]),b.createElement("section",{ref:i,className:"Toastify",id:E,onMouseEnter:()=>{o&&(s(!1),x.pause())},onMouseLeave:T,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":e["aria-label"]},n((v,h)=>{let l=h.length?{...y}:{...y,pointerEvents:"none"};return b.createElement("div",{tabIndex:-1,className:I(v),"data-stacked":o,style:l,key:`c-${v}`},h.map(({content:c,props:u})=>b.createElement(St,{...u,stacked:o,collapseAll:T,isIn:d(u.toastId,u.containerId),key:`t-${u.key}`},c)))}))}var Ut=`:root {
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
`,tt=new Map,Ft=(t,e)=>{lt(()=>{if(typeof document>"u")return;let o=document,r=tt.get(o);if(r){e&&r.setAttribute("nonce",e);return}let s=o.createElement("style");s.textContent=t,e&&s.setAttribute("nonce",e),o.head.appendChild(s),tt.set(o,s)},[e])};function qt(t){return Ft(Ut,t.nonce),b.createElement(Xt,{...t})}function Yt({header:t,children:e}){const{props:o}=dt(),{user:r,activeGroupId:s}=o.auth,i=o.flash||{},[n,d]=k.useState(!1);k.useEffect(()=>{i.success&&x.success(i.success,{toastId:Date.now()+Math.random()}),i.error&&x.error(i.error,{toastId:Date.now()+Math.random()})},[i]);const f=[{name:"Dashboard",href:route("dashboard"),active:route().current("dashboard"),icon:a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"})})},{name:"Auditoría IA",href:route("audit.index"),active:route().current("audit.*"),icon:a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"})})},{name:"Mis Grupos",href:route("groups.index"),active:route().current("groups.*"),icon:a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})})}],p=[{name:"Panel de Control",href:route("dashboard"),active:route().current("dashboard"),icon:a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})},{name:"Mis Grupos",href:route("groups.index"),active:route().current("groups.*"),icon:a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})})}],y=r.role==="docente"?f:p;return a.jsxs("div",{className:"flex h-screen bg-gray-50 text-gray-800 overflow-hidden font-sans",children:[a.jsx(qt,{position:"bottom-right",theme:"colored"}),a.jsxs("aside",{className:"hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-20",children:[a.jsxs("div",{className:"p-6 flex items-center space-x-3 border-b border-gray-100",children:[a.jsx(C,{href:"/",children:a.jsx(ft,{className:"block h-8 w-auto text-indigo-600"})}),a.jsx("span",{className:"font-extrabold text-lg tracking-wide text-gray-900",children:"Agentes Taller"})]}),a.jsxs("nav",{className:"flex-1 px-4 py-6 space-y-2 overflow-y-auto",children:[y.map(m=>a.jsxs(C,{href:m.href,className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${m.active?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[m.icon,m.name]},m.name)),r.role==="alumno"&&s&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"pt-6 pb-2",children:a.jsx("p",{className:"px-4 text-xs font-bold text-gray-400 uppercase tracking-wider",children:"Agilidad (Equipo)"})}),a.jsxs(C,{href:route("agile.backlog",s),className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current("agile.backlog")?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"})}),"Backlog"]}),a.jsxs(C,{href:route("agile.dailys",s),className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current("agile.dailys")?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})}),"Dailys"]}),a.jsxs(C,{href:route("agile.minutes",s),className:`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current("agile.minutes*")?"bg-indigo-50 font-bold text-indigo-700 shadow-sm":"text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"}`,children:[a.jsx("svg",{className:"w-5 h-5 mr-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"})}),"Actas y Acuerdos"]})]})]}),a.jsxs("div",{className:"p-4 border-t border-gray-200 bg-gray-50/50",children:[a.jsxs("div",{className:"mb-4 px-4 flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm",children:r.name.charAt(0)}),a.jsxs("div",{className:"overflow-hidden",children:[a.jsx("p",{className:"text-sm font-bold text-gray-900 truncate",children:r.name}),a.jsx("p",{className:"text-xs text-gray-500 truncate",children:r.email})]})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(C,{href:route("profile.edit"),className:"flex-1 text-center px-3 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm",children:"Perfil"}),a.jsx(C,{href:route("logout"),method:"post",as:"button",className:"flex-1 text-center px-3 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm",children:"Salir"})]})]})]}),a.jsxs("div",{className:"md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 flex justify-between items-center p-4 shadow-sm",children:[a.jsx("span",{className:"font-bold text-indigo-600",children:"Agentes Taller"}),a.jsx("button",{onClick:()=>d(!n),className:"p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none",children:a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:n?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"})})})]}),n&&a.jsx("div",{className:"md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex",onClick:()=>d(!1),children:a.jsxs("div",{className:"w-64 h-full bg-white flex flex-col shadow-2xl",onClick:m=>m.stopPropagation(),children:[a.jsxs("div",{className:"p-6 border-b border-gray-100 flex justify-between items-center",children:[a.jsx("span",{className:"font-extrabold text-lg text-indigo-600",children:"Menú"}),a.jsx("button",{onClick:()=>d(!1),className:"text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100",children:"✕"})]}),a.jsxs("nav",{className:"flex-1 p-4 space-y-2 overflow-y-auto",children:[y.map(m=>a.jsxs(C,{href:m.href,className:`flex items-center px-4 py-3 rounded-xl ${m.active?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:[m.icon,m.name]},m.name)),r.role==="alumno"&&s&&a.jsxs(a.Fragment,{children:[a.jsx("hr",{className:"my-4 border-gray-100"}),a.jsx(C,{href:route("agile.backlog",s),className:`flex items-center px-4 py-3 rounded-xl ${route().current("agile.backlog")?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:"📋 Backlog"}),a.jsx(C,{href:route("agile.dailys",s),className:`flex items-center px-4 py-3 rounded-xl ${route().current("agile.dailys")?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:"📅 Dailys"}),a.jsx(C,{href:route("agile.minutes",s),className:`flex items-center px-4 py-3 rounded-xl ${route().current("agile.minutes*")?"bg-indigo-50 font-bold text-indigo-700":"text-gray-600 hover:bg-gray-50"}`,children:"🎙️ Actas"})]})]}),a.jsxs("div",{className:"p-4 border-t border-gray-100",children:[a.jsx(C,{href:route("profile.edit"),className:"block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 mb-2",children:"Perfil"}),a.jsx(C,{href:route("logout"),method:"post",as:"button",className:"w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-bold",children:"Cerrar Sesión"})]})]})}),a.jsxs("div",{className:"flex-1 flex flex-col overflow-y-auto w-full pt-16 md:pt-0 bg-gray-50/50 relative",children:[t&&a.jsxs("header",{className:"px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full flex justify-between items-center relative z-10",children:[a.jsx("div",{className:"flex-1",children:t}),r.role==="alumno"&&a.jsx("div",{className:"ml-4",children:a.jsxs(C,{href:route("student.comments"),className:`relative p-2 transition-colors flex items-center justify-center rounded-full shadow-sm border ${r.unread_notifications_count>0?"bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100":"text-gray-500 hover:text-indigo-600 hover:bg-white border-transparent"}`,title:"Comentarios del Docente",children:[a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"})}),r.unread_notifications_count>0&&a.jsx("span",{className:"absolute top-0 right-0 flex h-5 w-5 transform translate-x-1/4 -translate-y-1/4",children:a.jsx("span",{className:"relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white items-center justify-center text-[10px] font-bold text-white shadow-md",children:r.unread_notifications_count})})]})})]}),a.jsx("main",{className:"px-4 sm:px-8 pb-12 max-w-7xl mx-auto w-full flex-1",children:e})]})]})}export{Yt as A,P as c,x as y};

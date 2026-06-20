import{j as i,G as v,b as T,e as ft,L}from"./app-_QROxwfr.js";function dt(t){return i.jsxs("svg",{...t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[i.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"}),i.jsx("path",{d:"M9 14h.01"}),i.jsx("path",{d:"M15 14h.01"}),i.jsx("path",{d:"M10 18h4"})]})}function et(t){var e,o,a="";if(typeof t=="string"||typeof t=="number")a+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(o=et(t[e]))&&(a&&(a+=" "),a+=o)}else for(o in t)t[o]&&(a&&(a+=" "),a+=o);return a}function P(){for(var t,e,o=0,a="",r=arguments.length;o<r;o++)(t=arguments[o])&&(e=et(t))&&(a&&(a+=" "),a+=e);return a}var B=t=>typeof t=="number"&&!isNaN(t),D=t=>typeof t=="string",z=t=>typeof t=="function",ut=t=>D(t)||B(t),V=t=>D(t)||z(t)?t:null,mt=(t,e)=>t===!1||B(t)&&t>0?t:e,q=t=>T.isValidElement(t)||D(t)||z(t)||B(t);function pt(t,e,o=300){let{scrollHeight:a,style:r}=t;requestAnimationFrame(()=>{r.minHeight="initial",r.height=a+"px",r.transition=`all ${o}ms`,requestAnimationFrame(()=>{r.height="0",r.padding="0",r.margin="0",setTimeout(e,o)})})}function yt({enter:t,exit:e,appendPosition:o=!1,collapse:a=!0,collapseDuration:r=300}){return function({children:n,position:s,preventExitTransition:f,done:d,nodeRef:p,isIn:_,playToast:w}){let I=o?`${t}--${s}`:t,E=o?`${e}--${s}`:e,C=T.useRef(0);return T.useLayoutEffect(()=>{let x=p.current,h=I.split(" "),y=l=>{l.target===p.current&&(w(),x.removeEventListener("animationend",y),x.removeEventListener("animationcancel",y),C.current===0&&l.type!=="animationcancel"&&x.classList.remove(...h))};x.classList.add(...h),x.addEventListener("animationend",y),x.addEventListener("animationcancel",y)},[]),T.useEffect(()=>{let x=p.current,h=()=>{x.removeEventListener("animationend",h),a?pt(x,d,r):d()};_||(f?h():(C.current=1,x.className+=` ${E}`,x.addEventListener("animationend",h)))},[_]),v.createElement(v.Fragment,null,n)}}function Z(t,e){return{content:ot(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function ot(t,e,o=!1){return T.isValidElement(t)&&!D(t.type)?T.cloneElement(t,{closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):z(t)?t({closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:o}):t}function gt({closeToast:t,theme:e,ariaLabel:o="close"}){return v.createElement("button",{className:`Toastify__close-button Toastify__close-button--${e}`,type:"button",onClick:a=>{a.stopPropagation(),t(!0)},"aria-label":o},v.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},v.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function ht({delay:t,isRunning:e,closeToast:o,type:a="default",hide:r,className:n,controlledProgress:s,progress:f,rtl:d,isIn:p,theme:_}){let w=r||s&&f===0,I={animationDuration:`${t}ms`,animationPlayState:e?"running":"paused"};s&&(I.transform=`scaleX(${f})`);let E=P("Toastify__progress-bar",s?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${_}`,`Toastify__progress-bar--${a}`,{"Toastify__progress-bar--rtl":d}),C=z(n)?n({rtl:d,type:a,defaultClassName:E}):P(E,n),x={[s&&f>=1?"onTransitionEnd":"onAnimationEnd"]:s&&f<1?null:()=>{p&&o()}};return v.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":w},v.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${_} Toastify__progress-bar--${a}`}),v.createElement("div",{role:"progressbar","aria-hidden":w?"true":"false","aria-label":"notification timer","aria-valuenow":s?Math.round(f*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:C,style:I,...x}))}var _t=1,at=()=>`${_t++}`;function bt(t,e,o){let a=1,r=0,n=[],s=[],f=e,d=new Map,p=new Set,_=l=>(p.add(l),()=>p.delete(l)),w=()=>{s=Array.from(d.values()),p.forEach(l=>l())},I=({containerId:l,toastId:c,updateId:u})=>{let k=l?l!==t:t!==1,j=d.has(c)&&u==null;return k||j},E=(l,c)=>{d.forEach(u=>{var k;(c==null||c===u.props.toastId)&&((k=u.toggle)==null||k.call(u,l))})},C=l=>{var c,u;l.isActive&&((u=(c=l.props)==null?void 0:c.onClose)==null||u.call(c,l.removalReason),l.isActive=!1,o(Z(l,"removed")))},x=l=>{if(l==null)d.forEach(C);else{let c=d.get(l);c&&C(c)}w()},h=()=>{r-=n.length,n=[]},y=l=>{var c,u;let{toastId:k,updateId:j}=l.props,m=j==null;l.staleId&&d.delete(l.staleId),l.isActive=!0,d.set(k,l),w(),o(Z(l,m?"added":"updated")),m&&((u=(c=l.props).onOpen)==null||u.call(c))};return{id:t,props:f,observe:_,toggle:E,removeToast:x,toasts:d,clearQueue:h,buildToast:(l,c)=>{if(I(c))return;let{toastId:u,updateId:k,data:j,staleId:m,delay:b}=c,M=k==null;M&&r++;let $={...f,style:f.toastStyle,key:a++,...Object.fromEntries(Object.entries(c).filter(([X,A])=>A!=null)),toastId:u,updateId:k,data:j,isIn:!1,className:V(c.className||f.toastClassName),progressClassName:V(c.progressClassName||f.progressClassName),autoClose:c.isLoading?!1:mt(c.autoClose,f.autoClose),closeToast(X){let A=d.get(u);A&&(A.removalReason=X,x(u))},deleteToast(){if(d.get(u)!=null){if(d.delete(u),r--,r<0&&(r=0),n.length>0){y(n.shift());return}w()}}};$.closeButton=f.closeButton,c.closeButton===!1||q(c.closeButton)?$.closeButton=c.closeButton:c.closeButton===!0&&($.closeButton=q(f.closeButton)?f.closeButton:!0);let O={content:l,props:$,staleId:m};f.limit&&f.limit>0&&r>f.limit&&M?n.push(O):B(b)?setTimeout(()=>{y(O)},b):y(O)},setProps(l){f=l},setToggle:(l,c)=>{let u=d.get(l);u&&(u.toggle=c)},isToastActive:l=>{var c;return(c=d.get(l))==null?void 0:c.isActive},getSnapshot:()=>s}}var N=new Map,R=[],W=new Set,vt=t=>W.forEach(e=>e(t)),rt=()=>N.size>0;function xt(){R.forEach(t=>nt(t.content,t.options)),R=[]}var Tt=(t,{containerId:e})=>{var o;return(o=N.get(e||1))==null?void 0:o.toasts.get(t)};function st(t,e){var o;if(e)return!!((o=N.get(e))!=null&&o.isToastActive(t));let a=!1;return N.forEach(r=>{r.isToastActive(t)&&(a=!0)}),a}function kt(t){if(!rt()){R=R.filter(e=>t!=null&&e.options.toastId!==t);return}if(t==null||ut(t))N.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=N.get(t.containerId);e?e.removeToast(t.id):N.forEach(o=>{o.removeToast(t.id)})}}var wt=(t={})=>{N.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})};function nt(t,e){q(t)&&(rt()||R.push({content:t,options:e}),N.forEach(o=>{o.buildToast(t,e)}))}function Et(t){var e;(e=N.get(t.containerId||1))==null||e.setToggle(t.id,t.fn)}function it(t,e){N.forEach(o=>{(e==null||!(e!=null&&e.containerId)||e?.containerId===o.id)&&o.toggle(t,e?.id)})}function It(t){let e=t.containerId||1;return{subscribe(o){let a=bt(e,t,vt);N.set(e,a);let r=a.observe(o);return xt(),()=>{r(),N.delete(e)}},setProps(o){var a;(a=N.get(e))==null||a.setProps(o)},getSnapshot(){var o;return(o=N.get(e))==null?void 0:o.getSnapshot()}}}function Nt(t){return W.add(t),()=>{W.delete(t)}}function Ct(t){return t&&(D(t.toastId)||B(t.toastId))?t.toastId:at()}function S(t,e){return nt(t,e),e.toastId}function U(t,e){return{...e,type:e&&e.type||t,toastId:Ct(e)}}function F(t){return(e,o)=>S(e,U(t,o))}function g(t,e){return S(t,U("default",e))}g.loading=(t,e)=>S(t,U("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e}));function jt(t,{pending:e,error:o,success:a},r){let n;e&&(n=D(e)?g.loading(e,r):g.loading(e.render,{...r,...e}));let s={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},f=(p,_,w)=>{if(_==null){g.dismiss(n);return}let I={type:p,...s,...r,data:w},E=D(_)?{render:_}:_;return n?g.update(n,{...I,...E}):g(E.render,{...I,...E}),w},d=z(t)?t():t;return d.then(p=>f("success",a,p)).catch(p=>f("error",o,p)),d}g.promise=jt;g.success=F("success");g.info=F("info");g.error=F("error");g.warning=F("warning");g.warn=g.warning;g.dark=(t,e)=>S(t,U("default",{theme:"dark",...e}));function Lt(t){kt(t)}g.dismiss=Lt;g.clearWaitingQueue=wt;g.isActive=st;g.update=(t,e={})=>{let o=Tt(t,e);if(o){let{props:a,content:r}=o,n={delay:100,...a,...e,toastId:e.toastId||t,updateId:at()};n.toastId!==t&&(n.staleId=t);let s=n.render||r;delete n.render,S(s,n)}};g.done=t=>{g.update(t,{progress:1})};g.onChange=Nt;g.play=t=>it(!0,t);g.pause=t=>it(!1,t);function Mt(t){var e;let{subscribe:o,getSnapshot:a,setProps:r}=T.useRef(It(t)).current;r(t);let n=(e=T.useSyncExternalStore(o,a,a))==null?void 0:e.slice();function s(f){if(!n)return[];let d=new Map;return t.newestOnTop&&n.reverse(),n.forEach(p=>{let{position:_}=p.props;d.has(_)||d.set(_,[]),d.get(_).push(p)}),Array.from(d,p=>f(p[0],p[1]))}return{getToastToRender:s,isToastActive:st,count:n?.length}}function $t(t){let[e,o]=T.useState(!1),[a,r]=T.useState(!1),n=T.useRef(null),s=T.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:f,pauseOnHover:d,closeToast:p,onClick:_,closeOnClick:w}=t;Et({id:t.toastId,containerId:t.containerId,fn:o}),T.useEffect(()=>{if(t.pauseOnFocusLoss)return I(),()=>{E()}},[t.pauseOnFocusLoss]);function I(){document.hasFocus()||y(),window.addEventListener("focus",h),window.addEventListener("blur",y)}function E(){window.removeEventListener("focus",h),window.removeEventListener("blur",y)}function C(m){if(t.draggable===!0||t.draggable===m.pointerType){l();let b=n.current;s.canCloseOnClick=!0,s.canDrag=!0,b.style.transition="none",t.draggableDirection==="x"?(s.start=m.clientX,s.removalDistance=b.offsetWidth*(t.draggablePercent/100)):(s.start=m.clientY,s.removalDistance=b.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function x(m){let{top:b,bottom:M,left:$,right:O}=n.current.getBoundingClientRect();m.pointerType==="mouse"&&t.pauseOnHover&&m.clientX>=$&&m.clientX<=O&&m.clientY>=b&&m.clientY<=M?y():h()}function h(){o(!0)}function y(){o(!1)}function l(){s.didMove=!1,document.addEventListener("pointermove",u),document.addEventListener("pointerup",k)}function c(){document.removeEventListener("pointermove",u),document.removeEventListener("pointerup",k)}function u(m){let b=n.current;if(s.canDrag&&b){s.didMove=!0,e&&y(),t.draggableDirection==="x"?s.delta=m.clientX-s.start:s.delta=m.clientY-s.start,s.start!==m.clientX&&(s.canCloseOnClick=!1);let M=t.draggableDirection==="x"?`${s.delta}px, var(--y)`:`0, calc(${s.delta}px + var(--y))`;b.style.transform=`translate3d(${M},0)`,b.style.opacity=`${1-Math.abs(s.delta/s.removalDistance)}`}}function k(){c();let m=n.current;if(s.canDrag&&s.didMove&&m){if(s.canDrag=!1,Math.abs(s.delta)>s.removalDistance){r(!0),t.closeToast(!0),t.collapseAll();return}m.style.transition="transform 0.2s, opacity 0.2s",m.style.removeProperty("transform"),m.style.removeProperty("opacity")}}let j={onPointerDown:C,onPointerUp:x};return f&&d&&(j.onMouseEnter=y,t.stacked||(j.onMouseLeave=h)),w&&(j.onClick=m=>{_&&_(m),s.canCloseOnClick&&p(!0)}),{playToast:h,pauseToast:y,isRunning:e,preventExitTransition:a,toastRef:n,eventHandlers:j}}var lt=typeof window<"u"?T.useLayoutEffect:T.useEffect,G=({theme:t,type:e,isLoading:o,...a})=>v.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${e})`,...a});function Ot(t){return v.createElement(G,{...t},v.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function zt(t){return v.createElement(G,{...t},v.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function At(t){return v.createElement(G,{...t},v.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function Pt(t){return v.createElement(G,{...t},v.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function Dt(){return v.createElement("div",{className:"Toastify__spinner"})}var Y={info:zt,warning:Ot,success:At,error:Pt,spinner:Dt},Rt=t=>t in Y;function Bt({theme:t,type:e,isLoading:o,icon:a}){let r=null,n={theme:t,type:e};return a===!1||(z(a)?r=a({...n,isLoading:o}):T.isValidElement(a)?r=T.cloneElement(a,n):o?r=Y.spinner():Rt(e)&&(r=Y[e](n))),r}var St=t=>{let{isRunning:e,preventExitTransition:o,toastRef:a,eventHandlers:r,playToast:n}=$t(t),{closeButton:s,children:f,autoClose:d,onClick:p,type:_,hideProgressBar:w,closeToast:I,transition:E,position:C,className:x,style:h,progressClassName:y,updateId:l,role:c,progress:u,rtl:k,toastId:j,deleteToast:m,isIn:b,isLoading:M,closeOnClick:$,theme:O,ariaLabel:X}=t,A=P("Toastify__toast",`Toastify__toast-theme--${O}`,`Toastify__toast--${_}`,{"Toastify__toast--rtl":k},{"Toastify__toast--close-on-click":$}),ct=z(x)?x({rtl:k,position:C,type:_,defaultClassName:A}):P(A,x),Q=Bt(t),J=!!u||!d,K={closeToast:I,type:_,theme:O},H=null;return s===!1||(z(s)?H=s(K):T.isValidElement(s)?H=T.cloneElement(s,K):H=gt(K)),v.createElement(E,{isIn:b,done:m,position:C,preventExitTransition:o,nodeRef:a,playToast:n},v.createElement("div",{id:j,tabIndex:0,onClick:p,"data-in":b,className:ct,...r,style:h,ref:a,...b&&{role:c,"aria-label":X}},Q!=null&&v.createElement("div",{className:P("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!M})},Q),ot(f,t,!e),H,!t.customProgressBar&&v.createElement(ht,{...l&&!J?{key:`p-${l}`}:{},rtl:k,theme:O,delay:d,isRunning:e,isIn:b,closeToast:I,hide:w,type:_,className:y,controlledProgress:J,progress:u||0})))},Xt=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),Ht=yt(Xt("bounce",!0)),Ut={position:"top-right",transition:Ht,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function Ft(t){let e={...Ut,...t},o=t.stacked,[a,r]=T.useState(!0),n=T.useRef(null),{getToastToRender:s,isToastActive:f,count:d}=Mt(e),{className:p,style:_,rtl:w,containerId:I,hotKeys:E}=e;function C(h){let y=P("Toastify__toast-container",`Toastify__toast-container--${h}`,{"Toastify__toast-container--rtl":w});return z(p)?p({position:h,rtl:w,defaultClassName:y}):P(y,V(p))}function x(){o&&(r(!0),g.play())}return lt(()=>{var h;if(o){let y=n.current.querySelectorAll('[data-in="true"]'),l=12,c=(h=e.position)==null?void 0:h.includes("top"),u=0,k=0;Array.from(y).reverse().forEach((j,m)=>{let b=j;b.classList.add("Toastify__toast--stacked"),m>0&&(b.dataset.collapsed=`${a}`),b.dataset.pos||(b.dataset.pos=c?"top":"bot");let M=u*(a?.2:1)+(a?0:l*m),$=Math.max(.5,1-(a?k:0));b.style.setProperty("--y",`${c?M:M*-1}px`),b.style.setProperty("--g",`${l}`),b.style.setProperty("--s",`${$}`),u+=b.offsetHeight,k+=.025})}},[a,d,o]),T.useEffect(()=>{function h(y){var l;let c=n.current;E(y)&&((l=c?.querySelector('[tabIndex="0"]'))==null||l.focus(),r(!1),g.pause()),y.key==="Escape"&&(document.activeElement===c||c!=null&&c.contains(document.activeElement))&&(r(!0),g.play())}return document.addEventListener("keydown",h),()=>{document.removeEventListener("keydown",h)}},[E]),v.createElement("section",{ref:n,className:"Toastify",id:I,onMouseEnter:()=>{o&&(r(!1),g.pause())},onMouseLeave:x,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":e["aria-label"]},s((h,y)=>{let l=y.length?{..._}:{..._,pointerEvents:"none"};return v.createElement("div",{tabIndex:-1,className:C(h),"data-stacked":o,style:l,key:`c-${h}`},y.map(({content:c,props:u})=>v.createElement(St,{...u,stacked:o,collapseAll:x,isIn:f(u.toastId,u.containerId),key:`t-${u.key}`},c)))}))}var Gt=`:root {
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
`,tt=new Map,Kt=(t,e)=>{lt(()=>{if(typeof document>"u")return;let o=document,a=tt.get(o);if(a){e&&a.setAttribute("nonce",e);return}let r=o.createElement("style");r.textContent=t,e&&r.setAttribute("nonce",e),o.head.appendChild(r),tt.set(o,r)},[e])};function Vt(t){return Kt(Gt,t.nonce),v.createElement(Ft,{...t})}function Wt({header:t,children:e}){const{props:o}=ft(),{user:a,activeGroupId:r}=o.auth,n=o.flash||{},[s,f]=T.useState(!1);return T.useEffect(()=>{n.success&&g.success(n.success),n.error&&g.error(n.error)},[n.success,n.error]),i.jsxs("div",{className:"flex h-screen bg-notion-bg text-notion-text overflow-hidden font-sans",children:[i.jsx(Vt,{position:"bottom-right",theme:"colored"}),i.jsxs("aside",{className:"hidden md:flex flex-col w-64 bg-notion-sidebar border-r border-notion-border shadow-sm",children:[i.jsxs("div",{className:"p-5 flex items-center space-x-3",children:[i.jsx(L,{href:"/",children:i.jsx(dt,{className:"block h-8 w-auto text-notion-blue"})}),i.jsx("span",{className:"font-bold text-lg tracking-wide text-notion-blue",children:"Corporativo IA"})]}),i.jsxs("nav",{className:"flex-1 px-3 py-4 space-y-1",children:[i.jsx(L,{href:route("dashboard"),className:`flex items-center px-3 py-2 rounded-md transition-colors ${route().current("dashboard")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover hover:text-notion-text"}`,children:"Panel de Control"}),i.jsx(L,{href:route("groups.index"),className:`flex items-center px-3 py-2 rounded-md transition-colors ${route().current("groups.*")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover hover:text-notion-text"}`,children:"Gestión de Grupos"}),a.role==="alumno"&&r&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"pt-4 pb-2",children:i.jsx("p",{className:"px-3 text-xs font-semibold text-notion-textMuted uppercase tracking-wider",children:"Agilidad (Grupo Actual)"})}),i.jsx(L,{href:route("agile.backlog",r),className:`flex items-center px-3 py-2 rounded-md transition-colors ${route().current("agile.backlog")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover hover:text-notion-text"}`,children:"📋 Backlog Kanban"}),i.jsx(L,{href:route("agile.dailys",r),className:`flex items-center px-3 py-2 rounded-md transition-colors ${route().current("agile.dailys")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover hover:text-notion-text"}`,children:"📅 Dailys"})]})]}),i.jsxs("div",{className:"p-4 border-t border-notion-border bg-gray-50",children:[i.jsxs("div",{className:"mb-3 px-3",children:[i.jsx("p",{className:"text-sm font-bold text-notion-text",children:a.name}),i.jsx("p",{className:"text-xs text-notion-textMuted",children:a.email})]}),i.jsx(L,{href:route("profile.edit"),className:"block px-3 py-2 text-sm text-notion-textMuted rounded-md hover:bg-notion-hover hover:text-notion-text transition-colors",children:"Configuración"}),i.jsx(L,{href:route("logout"),method:"post",as:"button",className:"w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 transition-colors text-red-500 hover:text-red-700",children:"Cerrar Sesión"})]})]}),i.jsxs("div",{className:"md:hidden fixed top-0 w-full bg-notion-sidebar border-b border-notion-border z-10 flex justify-between items-center p-4 shadow-sm",children:[i.jsx("span",{className:"font-bold text-notion-blue",children:"Corporativo IA"}),i.jsx("button",{onClick:()=>f(!s),className:"p-2 text-notion-text hover:bg-notion-hover rounded-md focus:outline-none",children:i.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:i.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"})})})]}),s&&i.jsx("div",{className:"md:hidden fixed inset-0 bg-black bg-opacity-40 z-20 flex",onClick:()=>f(!1),children:i.jsxs("div",{className:"w-64 h-full bg-notion-sidebar p-4 flex flex-col shadow-xl",onClick:d=>d.stopPropagation(),children:[i.jsxs("div",{className:"flex justify-between items-center mb-8",children:[i.jsx("span",{className:"font-bold text-lg text-notion-blue",children:"Menú"}),i.jsx("button",{onClick:()=>f(!1),className:"text-notion-textMuted hover:text-notion-text",children:"✕"})]}),i.jsxs("nav",{className:"flex-1 space-y-2",children:[i.jsx(L,{href:route("dashboard"),className:`block px-3 py-3 rounded-md ${route().current("dashboard")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover"}`,children:"Panel de Control"}),i.jsx(L,{href:route("groups.index"),className:`block px-3 py-3 rounded-md ${route().current("groups.*")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover"}`,children:"Gestión de Grupos"}),a.role==="alumno"&&r&&i.jsxs(i.Fragment,{children:[i.jsx("hr",{className:"my-2 border-notion-border"}),i.jsx(L,{href:route("agile.backlog",r),className:`block px-3 py-3 rounded-md ${route().current("agile.backlog")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover"}`,children:"📋 Backlog"}),i.jsx(L,{href:route("agile.dailys",r),className:`block px-3 py-3 rounded-md ${route().current("agile.dailys")?"bg-notion-hover font-bold text-notion-blue":"text-notion-textMuted hover:bg-notion-hover"}`,children:"📅 Dailys"})]}),i.jsx("hr",{className:"my-2 border-notion-border"}),i.jsx(L,{href:route("profile.edit"),className:"block px-3 py-3 rounded-md text-notion-textMuted hover:bg-notion-hover",children:"Perfil"}),i.jsx(L,{href:route("logout"),method:"post",as:"button",className:"w-full text-left px-3 py-3 rounded-md hover:bg-red-50 text-red-500",children:"Cerrar Sesión"})]})]})}),i.jsxs("div",{className:"flex-1 flex flex-col overflow-y-auto w-full pt-16 md:pt-0 bg-notion-bg",children:[t&&i.jsx("header",{className:"px-8 py-6 max-w-5xl mx-auto w-full",children:t}),i.jsx("main",{className:"px-8 pb-12 max-w-5xl mx-auto w-full flex-1",children:e})]})]})}export{Wt as A};

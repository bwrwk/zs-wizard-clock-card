/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$3=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$3=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$2});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i$2});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n="important",i=" !"+n,o=e(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(r)),this.render(r);for(const t of this.ft)null==r[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ft.add(t);const r="string"==typeof e&&e.endsWith(i);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n:""):s[t]=e;}}return E}});

const CARD_TAG = 'zs-wizard-clock-card';
const DEFAULT_CONFIG = {
    type: `custom:${CARD_TAG}`,
    title: 'Wizard Clock',
    subtitle: '',
    default_place: '',
    places: [],
    wizards: [],
    style: {
        preset: 'brass',
        ha_theme: '',
        accent_color: '',
        background: '',
        text_color: '',
        inner_glow: true,
        danger_glow: true,
        show_legend: true,
        show_center_panel: true,
        show_place_sectors: true,
        sector_opacity: 0.16,
        show_ornaments: true,
    },
};
const PRESET_STYLES = {
    brass: {
        background: 'radial-gradient(circle at 50% 35%, rgba(255,244,216,0.98), rgba(209,182,130,0.96) 58%, rgba(98,67,33,0.96) 100%)',
        cardBackground: 'linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98))',
        text: '#f8ecd2',
        muted: 'rgba(248, 236, 210, 0.74)',
        rim: '#3c2412',
        accent: '#d9b36e',
        face: '#efe1c3',
        faceShadow: 'rgba(69, 39, 15, 0.34)',
        center: '#5f3516',
    },
    parchment: {
        background: 'radial-gradient(circle at 50% 35%, rgba(253,245,225,0.98), rgba(235,223,190,0.96) 62%, rgba(174,147,92,0.92) 100%)',
        cardBackground: 'linear-gradient(180deg, rgba(113, 89, 51, 0.92), rgba(53, 38, 20, 0.97))',
        text: '#2d2417',
        muted: 'rgba(45, 36, 23, 0.62)',
        rim: '#715933',
        accent: '#b7873a',
        face: '#f5ebd2',
        faceShadow: 'rgba(105, 78, 35, 0.2)',
        center: '#6b4a21',
    },
    ministry: {
        background: 'radial-gradient(circle at 50% 35%, rgba(231,241,242,0.98), rgba(125,161,153,0.94) 60%, rgba(25,53,58,0.98) 100%)',
        cardBackground: 'linear-gradient(180deg, rgba(14, 43, 47, 0.96), rgba(8, 23, 26, 0.99))',
        text: '#ebf6f4',
        muted: 'rgba(235, 246, 244, 0.74)',
        rim: '#0f3034',
        accent: '#6dc3b6',
        face: '#d7ebe5',
        faceShadow: 'rgba(7, 27, 28, 0.28)',
        center: '#1d4d54',
    },
};
function mergeConfig(config) {
    return {
        ...DEFAULT_CONFIG,
        ...config,
        style: {
            ...DEFAULT_CONFIG.style,
            ...(config.style || {}),
        },
        places: config.places || [],
        wizards: config.wizards || [],
    };
}
function normalize(value) {
    return String(value ?? '').trim().toLowerCase();
}
function asArray(value) {
    if (value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
function normalizeList(value) {
    if (value === undefined || value === null || value === '') {
        return [];
    }
    if (Array.isArray(value)) {
        return value
            .flatMap((entry) => normalizeList(entry))
            .filter(Boolean);
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((entry) => normalize(entry))
            .filter(Boolean);
    }
    if (typeof value === 'object') {
        return Object.values(value)
            .flatMap((entry) => normalizeList(entry))
            .filter(Boolean);
    }
    return [normalize(value)].filter(Boolean);
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function polarX(angle, radius) {
    return 50 + Math.cos(angle - Math.PI / 2) * radius;
}
function polarY(angle, radius) {
    return 50 + Math.sin(angle - Math.PI / 2) * radius;
}
function buildArcPath(angle, radius, span = 0.56) {
    const startAngle = angle - span / 2;
    const endAngle = angle + span / 2;
    const startX = polarX(startAngle, radius);
    const startY = polarY(startAngle, radius);
    const endX = polarX(endAngle, radius);
    const endY = polarY(endAngle, radius);
    const largeArc = span > Math.PI ? 1 : 0;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
}
function buildRingSlicePath(angle, innerRadius, outerRadius, width) {
    const startAngle = angle - width / 2;
    const endAngle = angle + width / 2;
    const outerStartX = polarX(startAngle, outerRadius);
    const outerStartY = polarY(startAngle, outerRadius);
    const outerEndX = polarX(endAngle, outerRadius);
    const outerEndY = polarY(endAngle, outerRadius);
    const innerEndX = polarX(endAngle, innerRadius);
    const innerEndY = polarY(endAngle, innerRadius);
    const innerStartX = polarX(startAngle, innerRadius);
    const innerStartY = polarY(startAngle, innerRadius);
    const largeArc = width > Math.PI ? 1 : 0;
    return [
        `M ${outerStartX} ${outerStartY}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
        `L ${innerEndX} ${innerEndY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
        'Z',
    ].join(' ');
}
function computeInitials(name) {
    const parts = name.split(' ').filter(Boolean).slice(0, 2);
    if (!parts.length) {
        return '?';
    }
    return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}
function colorWithAlpha(color, alpha) {
    if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    if (color.startsWith('rgba(')) {
        return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
    }
    if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
        const normalized = color.length === 4
            ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
            : color;
        const hexAlpha = Math.round(clamp(alpha, 0, 1) * 255).toString(16).padStart(2, '0');
        return `${normalized}${hexAlpha}`;
    }
    return color;
}
function getEntityObjectId(entityId) {
    return String(entityId || '').split('.').slice(1).join('.') || String(entityId || '');
}
function getZoneMatchValues(place, hass) {
    const values = new Set();
    for (const zoneEntityId of asArray(place.zone_entities)) {
        const zoneEntity = hass.states?.[zoneEntityId];
        const objectId = getEntityObjectId(zoneEntityId);
        if (objectId) {
            values.add(normalize(objectId));
        }
        if (zoneEntity?.attributes?.friendly_name) {
            values.add(normalize(zoneEntity.attributes.friendly_name));
        }
        if (zoneEntity?.state) {
            values.add(normalize(zoneEntity.state));
        }
    }
    return [...values];
}
function getEntityAttribute(entity, attribute) {
    if (!entity) {
        return undefined;
    }
    if (!attribute || attribute === 'state') {
        return entity.state;
    }
    return entity.attributes?.[attribute];
}
function evaluateEntityCondition(condition, hass) {
    const entity = hass.states?.[condition.entity];
    const rawValue = getEntityAttribute(entity, condition.attribute);
    if (condition.state !== undefined) {
        return String(rawValue) === String(condition.state);
    }
    if (condition.states?.length) {
        return normalizeList(condition.states).includes(normalize(rawValue));
    }
    if (condition.above !== undefined) {
        return Number(rawValue) > Number(condition.above);
    }
    if (condition.below !== undefined) {
        return Number(rawValue) < Number(condition.below);
    }
    return !!rawValue;
}
function deriveWizardContext(entity, proximityEntity) {
    if (!entity) {
        return {
            state: 'unavailable',
            zone: '',
            locality: '',
            friendlyZone: '',
            speed: 0,
            moving: false,
            proximity: '',
            unavailable: true,
            unknown: false,
            notHome: true,
        };
    }
    const state = String(entity.state ?? '');
    const attributes = entity.attributes || {};
    const zone = String(attributes.zone ?? state ?? '');
    const friendlyZone = String(attributes.friendly_name ?? '');
    const locality = String(attributes.locality ?? attributes.city ?? '');
    const speed = Number(attributes.velocity ?? attributes.speed ?? 0);
    const moving = Boolean(attributes.moving) || speed > 0;
    const proximity = String(proximityEntity?.state ?? '');
    const unavailable = ['unavailable'].includes(normalize(state));
    const unknown = ['unknown'].includes(normalize(state));
    const notHome = ['not_home', 'away'].includes(normalize(state));
    return {
        state,
        zone,
        locality,
        friendlyZone,
        speed: Number.isFinite(speed) ? speed : 0,
        moving,
        proximity,
        unavailable,
        unknown,
        notHome,
    };
}
function matchesPlace(place, context, hass) {
    const match = place.match;
    if (!match) {
        return false;
    }
    const state = normalize(context.state);
    const zone = normalize(context.zone);
    const locality = normalize(context.locality);
    const friendlyZone = normalize(context.friendlyZone);
    const proximity = normalize(context.proximity);
    const checks = [];
    if (match.states?.length) {
        checks.push(normalizeList(match.states).includes(state));
    }
    if (match.zones?.length) {
        const configuredZones = normalizeList(match.zones);
        checks.push(configuredZones.includes(zone) || configuredZones.includes(state) || configuredZones.includes(friendlyZone));
    }
    if (asArray(place.zone_entities).length) {
        const zoneMatches = getZoneMatchValues(place, hass);
        checks.push(zoneMatches.includes(zone)
            || zoneMatches.includes(state)
            || zoneMatches.includes(friendlyZone));
    }
    if (match.localities?.length) {
        checks.push(normalizeList(match.localities).includes(locality));
    }
    if (match.min_speed !== undefined) {
        checks.push(context.speed >= Number(match.min_speed));
    }
    if (match.max_speed !== undefined) {
        checks.push(context.speed <= Number(match.max_speed));
    }
    if (match.moving !== undefined) {
        checks.push(context.moving === Boolean(match.moving));
    }
    if (match.proximity_directions?.length) {
        checks.push(normalizeList(match.proximity_directions).includes(proximity));
    }
    if (match.unavailable) {
        checks.push(context.unavailable);
    }
    if (match.unknown) {
        checks.push(context.unknown);
    }
    if (match.not_home) {
        checks.push(context.notHome);
    }
    if (match.entities?.length) {
        checks.push(match.entities.every((condition) => evaluateEntityCondition(condition, hass)));
    }
    return checks.length > 0 && checks.every(Boolean);
}
class ZSWizardClockCard extends i$2 {
    static getStubConfig() {
        return {
            type: `custom:${CARD_TAG}`,
            title: 'Family Clock',
            subtitle: 'The Burrow',
            default_place: 'unknown',
            style: {
                preset: 'brass',
                show_place_sectors: false,
                show_center_panel: true,
                show_legend: true,
                show_ornaments: true,
            },
            places: [
                {
                    id: 'home',
                    label: 'W domu',
                    zone_entities: ['zone.home'],
                    match: {
                        states: ['home'],
                        zones: ['home'],
                    },
                },
                {
                    id: 'travelling',
                    label: 'W podróży',
                    kind: 'transient',
                    priority: 80,
                    match: {
                        moving: true,
                        min_speed: 8,
                    },
                },
                {
                    id: 'unknown',
                    label: 'Nieznane',
                    kind: 'fallback',
                },
            ],
            wizards: [
                {
                    entity: 'person.example',
                    name: 'Harry',
                },
            ],
        };
    }
    static getConfigForm() {
        return {
            schema: [
                { name: 'title', selector: { text: {} } },
                { name: 'subtitle', selector: { text: {} } },
                { name: 'default_place', selector: { text: {} } },
                {
                    type: 'expandable',
                    name: 'style',
                    title: 'Style',
                    schema: [
                        {
                            name: 'preset',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'brass', label: 'Brass' },
                                        { value: 'parchment', label: 'Parchment' },
                                        { value: 'ministry', label: 'Ministry' },
                                    ],
                                },
                            },
                        },
                        { name: 'ha_theme', selector: { theme: {} } },
                        { name: 'accent_color', selector: { text: {} } },
                        { name: 'background', selector: { text: {} } },
                        { name: 'text_color', selector: { text: {} } },
                        { name: 'inner_glow', selector: { boolean: {} } },
                        { name: 'danger_glow', selector: { boolean: {} } },
                        { name: 'show_legend', selector: { boolean: {} } },
                        { name: 'show_center_panel', selector: { boolean: {} } },
                        { name: 'show_place_sectors', selector: { boolean: {} } },
                        { name: 'show_ornaments', selector: { boolean: {} } },
                        {
                            name: 'sector_opacity',
                            selector: {
                                number: {
                                    min: 0,
                                    max: 1,
                                    step: 0.05,
                                    mode: 'slider',
                                },
                            },
                        },
                    ],
                },
                {
                    name: 'places',
                    selector: {
                        object: {
                            multiple: true,
                            label_field: 'label',
                            description_field: 'id',
                            fields: {
                                id: { required: true, selector: { text: {} } },
                                label: { required: true, selector: { text: {} } },
                                short_label: { selector: { text: {} } },
                                kind: {
                                    selector: {
                                        select: {
                                            options: [
                                                { value: 'place', label: 'Place' },
                                                { value: 'transient', label: 'Transient' },
                                                { value: 'alert', label: 'Alert' },
                                                { value: 'fallback', label: 'Fallback' },
                                            ],
                                        },
                                    },
                                },
                                priority: {
                                    selector: {
                                        number: { min: 0, max: 100, step: 1, mode: 'box' },
                                    },
                                },
                                color: { selector: { text: {} } },
                                zone_entities: {
                                    selector: {
                                        entity: {
                                            multiple: true,
                                            filter: [
                                                { domain: 'zone' },
                                            ],
                                        },
                                    },
                                },
                                match: {
                                    selector: {
                                        object: {
                                            fields: {
                                                states: { selector: { text: { multiple: true } } },
                                                zones: { selector: { text: { multiple: true } } },
                                                localities: { selector: { text: { multiple: true } } },
                                                min_speed: {
                                                    selector: {
                                                        number: { min: 0, max: 300, step: 1, mode: 'box' },
                                                    },
                                                },
                                                max_speed: {
                                                    selector: {
                                                        number: { min: 0, max: 300, step: 1, mode: 'box' },
                                                    },
                                                },
                                                moving: { selector: { boolean: {} } },
                                                unavailable: { selector: { boolean: {} } },
                                                unknown: { selector: { boolean: {} } },
                                                not_home: { selector: { boolean: {} } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    name: 'wizards',
                    selector: {
                        object: {
                            multiple: true,
                            label_field: 'name',
                            description_field: 'entity',
                            fields: {
                                entity: {
                                    required: true,
                                    selector: {
                                        entity: {
                                            filter: [
                                                { domain: 'person' },
                                                { domain: 'device_tracker' },
                                                { domain: 'calendar' },
                                            ],
                                        },
                                    },
                                },
                                name: { selector: { text: {} } },
                                color: { selector: { text: {} } },
                                text_color: { selector: { text: {} } },
                                ring_color: { selector: { text: {} } },
                                avatar: { selector: { text: {} } },
                                show_avatar: { selector: { boolean: {} } },
                                proximity_entity: {
                                    selector: {
                                        entity: {
                                            filter: [
                                                { domain: 'sensor' },
                                                { domain: 'proximity' },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
            computeLabel: (schema) => {
                const labels = {
                    title: 'Title',
                    subtitle: 'Subtitle',
                    default_place: 'Default place',
                    preset: 'Preset',
                    ha_theme: 'Home Assistant theme',
                    accent_color: 'Accent color',
                    background: 'Background',
                    text_color: 'Text color',
                    inner_glow: 'Inner glow',
                    danger_glow: 'Danger glow',
                    show_legend: 'Show legend',
                    show_center_panel: 'Show center panel',
                    show_place_sectors: 'Show place sectors',
                    show_ornaments: 'Show ornaments',
                    sector_opacity: 'Sector opacity',
                    places: 'Places',
                    wizards: 'Wizards',
                    id: 'ID',
                    label: 'Label',
                    short_label: 'Short label',
                    kind: 'Kind',
                    priority: 'Priority',
                    color: 'Color',
                    zone_entities: 'Zone entities',
                    match: 'Match rules',
                    states: 'States',
                    zones: 'Zones',
                    localities: 'Localities',
                    min_speed: 'Min speed',
                    max_speed: 'Max speed',
                    moving: 'Moving',
                    unavailable: 'Unavailable',
                    unknown: 'Unknown',
                    not_home: 'Not home',
                    entity: 'Entity',
                    name: 'Name',
                    ring_color: 'Ring color',
                    avatar: 'Avatar URL',
                    show_avatar: 'Use entity picture',
                    proximity_entity: 'Proximity entity',
                };
                return labels[schema.name] || schema.name;
            },
            computeHelper: (schema) => {
                const helpers = {
                    default_place: 'Fallback place ID used when no matching rule is found.',
                    show_place_sectors: 'Shows subtle colored sectors behind place labels on the dial.',
                    show_ornaments: 'Shows decorative rim details around the clock face.',
                    sector_opacity: 'Controls how visible the sectors are when enabled.',
                    places: 'Define locations shown around the dial and how they match entity states.',
                    zone_entities: 'Easy mode: pick one or more zone entities instead of typing zone names manually.',
                    wizards: 'Tracked people, device trackers or calendars shown as clock hands.',
                    match: 'Basic rule editor for common matching cases. Advanced YAML fields still work.',
                    avatar: 'Optional image URL used instead of entity_picture.',
                    show_avatar: 'If enabled, uses entity_picture when available.',
                    proximity_entity: 'Optional sensor or proximity entity used to detect motion direction.',
                };
                return helpers[schema.name];
            },
        };
    }
    setConfig(config) {
        if (!config?.places?.length) {
            throw new Error('Specify at least one place in `places`.');
        }
        if (!config?.wizards?.length) {
            throw new Error('Specify at least one wizard in `wizards`.');
        }
        this.config = mergeConfig(config);
    }
    getCardSize() {
        return 8;
    }
    getGridOptions() {
        return {
            columns: 12,
            min_columns: 6,
            rows: 8,
            min_rows: 6,
        };
    }
    get isDarkMode() {
        return Boolean(this.hass?.themes?.darkMode);
    }
    get selectedPreset() {
        return PRESET_STYLES[this.config.style?.preset || 'brass'] || PRESET_STYLES.brass;
    }
    get selectedThemeVariables() {
        const themeName = this.config.style?.ha_theme;
        if (!themeName) {
            return {};
        }
        return { ...(this.hass?.themes?.themes?.[themeName] || {}) };
    }
    get orderedPlaces() {
        return [...this.config.places].sort((left, right) => {
            const priorityDelta = Number(right.priority || 0) - Number(left.priority || 0);
            return priorityDelta || this.config.places.indexOf(left) - this.config.places.indexOf(right);
        });
    }
    get fallbackTextColor() {
        return this.config.style?.text_color || this.selectedPreset.text;
    }
    get summaryPlace() {
        const alerts = this.resolvedWizards.filter((wizard) => wizard.place.kind === 'alert');
        if (alerts.length) {
            return alerts[0].place;
        }
        const transient = this.resolvedWizards.filter((wizard) => wizard.place.kind === 'transient');
        if (transient.length) {
            return transient[0].place;
        }
        return this.resolvedWizards[0]?.place;
    }
    get alertCount() {
        return this.resolvedWizards.filter((wizard) => wizard.place.kind === 'alert').length;
    }
    resolvePlaceForWizard(wizard) {
        const entity = this.hass?.states?.[wizard.entity];
        const proximityEntity = wizard.proximity_entity ? this.hass?.states?.[wizard.proximity_entity] : undefined;
        const context = deriveWizardContext(entity, proximityEntity);
        const matched = this.orderedPlaces.find((place) => matchesPlace(place, context, this.hass));
        if (matched) {
            return matched;
        }
        if (normalize(context.state) === 'home') {
            const homeLikePlace = this.config.places.find((place) => {
                const zones = normalizeList(place.match?.zones);
                const states = normalizeList(place.match?.states);
                const zoneEntities = getZoneMatchValues(place, this.hass);
                return normalize(place.id) === 'home'
                    || states.includes('home')
                    || zones.includes('home')
                    || zoneEntities.includes('home');
            });
            if (homeLikePlace) {
                return homeLikePlace;
            }
        }
        if (this.config.default_place) {
            const configuredDefault = this.config.places.find((place) => place.id === this.config.default_place);
            if (configuredDefault) {
                return configuredDefault;
            }
        }
        return this.config.places[this.config.places.length - 1];
    }
    get resolvedWizards() {
        const places = this.config.places;
        return this.config.wizards.map((wizard, index) => {
            const place = this.resolvePlaceForWizard(wizard);
            const entity = this.hass?.states?.[wizard.entity];
            const placeIndex = Math.max(0, places.findIndex((item) => item.id === place.id));
            const angle = (Math.PI * 2 * placeIndex) / Math.max(places.length, 1);
            const name = wizard.name || entity?.attributes?.friendly_name || wizard.entity;
            return {
                name,
                initials: computeInitials(name),
                color: wizard.color || `hsl(${(index * 83 + 12) % 360} 52% 38%)`,
                textColor: wizard.text_color || '#fff8ed',
                ringColor: wizard.ring_color || 'rgba(255, 248, 230, 0.42)',
                entityId: wizard.entity,
                place,
                angle,
                placeIndex,
                avatar: wizard.avatar || (wizard.show_avatar === false ? '' : entity?.attributes?.entity_picture || ''),
                entity,
            };
        });
    }
    getRotationForWizard(wizard) {
        const group = this.resolvedWizards.filter((item) => item.placeIndex === wizard.placeIndex);
        const groupIndex = group.findIndex((item) => item.entityId === wizard.entityId);
        const spread = group.length > 1 ? ((groupIndex - (group.length - 1) / 2) / group.length) * 18 : 0;
        return (wizard.angle * 180) / Math.PI + spread;
    }
    openMoreInfo(entityId) {
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId };
        this.dispatchEvent(event);
    }
    computeCardStyle() {
        const preset = this.selectedPreset;
        return {
            ...this.selectedThemeVariables,
            '--zs-clock-card-bg': this.config.style?.background || preset.cardBackground,
            '--zs-clock-text': this.config.style?.text_color || preset.text,
            '--zs-clock-muted': preset.muted,
            '--zs-clock-accent': this.config.style?.accent_color || preset.accent,
            '--zs-clock-rim': preset.rim,
            '--zs-clock-face': preset.face,
            '--zs-clock-shadow': preset.faceShadow,
            '--zs-clock-center': preset.center,
        };
    }
    renderDial() {
        const places = this.config.places;
        const resolved = this.resolvedWizards;
        const placeStep = (Math.PI * 2) / Math.max(places.length, 1);
        const supportsDangerGlow = this.config.style?.danger_glow !== false
            && resolved.some((wizard) => wizard.place.kind === 'alert');
        return w `
      <svg viewBox="0 0 100 100" role="img" aria-label=${this.config.title || 'Wizard clock'}>
        <defs>
          <radialGradient id="faceGradient" cx="50%" cy="34%" r="70%">
            <stop offset="0%" stop-color=${this.selectedPreset.background.includes('rgba') ? '#fff7e7' : '#fff7e7'}></stop>
            <stop offset="68%" stop-color="var(--zs-clock-face)"></stop>
            <stop offset="100%" stop-color=${this.selectedPreset.rim}></stop>
          </radialGradient>
          <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.35 0"
              result="shadow"
            ></feColorMatrix>
            <feMerge>
              <feMergeNode in="shadow"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <filter id="dangerGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.4" result="coloredBlur"></feGaussianBlur>
            <feFlood flood-color="#c2361d" flood-opacity="0.42"></feFlood>
            <feComposite in2="coloredBlur" operator="in"></feComposite>
            <feMerge>
              <feMergeNode></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          ${places.map((place, index) => {
            const angle = placeStep * index;
            return w `<path id="place-arc-${index}" d=${buildArcPath(angle, 39)} fill="none"></path>`;
        })}
        </defs>

        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--zs-clock-rim)"
          stroke-width="2.8"
        ></circle>
        <circle
          cx="50"
          cy="50"
          r="44.6"
          fill="none"
          stroke="color-mix(in srgb, var(--zs-clock-accent) 72%, white)"
          stroke-width="0.9"
          opacity="0.88"
        ></circle>
        ${this.config.style?.show_ornaments === false ? '' : w `
          ${places.map((_, index) => {
            const angle = placeStep * index;
            const ornamentX = polarX(angle, 43.15);
            const ornamentY = polarY(angle, 43.15);
            return w `
              <circle
                cx=${ornamentX}
                cy=${ornamentY}
                r="0.72"
                fill="color-mix(in srgb, var(--zs-clock-accent) 75%, white)"
                opacity="0.95"
              ></circle>
            `;
        })}
          ${[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => {
            const starX = polarX(angle, 45.6);
            const starY = polarY(angle, 45.6);
            return w `
              <g transform="translate(${starX} ${starY}) rotate(${(angle * 180) / Math.PI})">
                <path
                  d="M 0 -1.6 L 0.42 -0.42 L 1.6 0 L 0.42 0.42 L 0 1.6 L -0.42 0.42 L -1.6 0 L -0.42 -0.42 Z"
                  fill="color-mix(in srgb, var(--zs-clock-accent) 82%, white)"
                  opacity="0.88"
                ></path>
              </g>
            `;
        })}
        `}
        <circle
          cx="50"
          cy="50"
          r="41.6"
          fill="url(#faceGradient)"
          filter=${this.config.style?.inner_glow === false ? 'none' : 'url(#innerGlow)'}
        ></circle>

        ${this.config.style?.show_place_sectors === false ? '' : places.map((place, index) => {
            const angle = placeStep * index;
            const sectorColor = colorWithAlpha(place.color || 'var(--zs-clock-accent)', Number(this.config.style?.sector_opacity ?? 0.16));
            return w `
            <path
              d=${buildRingSlicePath(angle, 22.5, 39.8, Math.max(placeStep - 0.1, 0.28))}
              fill=${sectorColor}
              opacity=${place.kind === 'alert' ? '0.8' : '1'}
            ></path>
          `;
        })}

        ${supportsDangerGlow ? w `
          <circle
            cx="50"
            cy="50"
            r="40.2"
            fill="none"
            stroke="rgba(194, 54, 29, 0.45)"
            stroke-width="0.8"
            filter="url(#dangerGlow)"
          ></circle>
        ` : ''}

        ${places.map((place, index) => {
            const angle = placeStep * index;
            const tickInnerX = polarX(angle, 31.2);
            const tickInnerY = polarY(angle, 31.2);
            const tickOuterX = polarX(angle, 38.1);
            const tickOuterY = polarY(angle, 38.1);
            return w `
            <line
              x1=${tickInnerX}
              y1=${tickInnerY}
              x2=${tickOuterX}
              y2=${tickOuterY}
              stroke="color-mix(in srgb, var(--zs-clock-rim) 60%, transparent)"
              stroke-width="0.5"
            ></line>
            <text class="place-label">
              <textPath href="#place-arc-${index}" startOffset="50%" text-anchor="middle">
                ${place.short_label || place.label}
              </textPath>
            </text>
          `;
        })}

        ${resolved.map((wizard, index) => this.renderHand(wizard, index))}

        ${this.config.style?.show_center_panel === false ? '' : w `
          <g>
            <circle cx="50" cy="50" r="13.4" fill="rgba(34, 20, 9, 0.16)"></circle>
            <circle
              cx="50"
              cy="50"
              r="12.4"
              fill="rgba(255, 251, 243, 0.16)"
              stroke="color-mix(in srgb, var(--zs-clock-accent) 52%, white)"
              stroke-width="0.35"
            ></circle>
            <text
              x="50"
              y="47.8"
              text-anchor="middle"
              font-family="var(--zs-clock-title)"
              font-size="2.5"
              fill=${this.fallbackTextColor}
            >
              ${this.summaryPlace?.short_label || this.summaryPlace?.label || 'Clock'}
            </text>
            <text
              x="50"
              y="52"
              text-anchor="middle"
              font-family="var(--zs-clock-copy)"
              font-size="1.95"
              fill="var(--zs-clock-muted)"
            >
              ${this.resolvedWizards.length} tracked
            </text>
            <text
              x="50"
              y="55.4"
              text-anchor="middle"
              font-family="var(--zs-clock-copy)"
              font-size="1.75"
              fill=${this.alertCount ? '#b33a27' : 'var(--zs-clock-muted)'}
            >
              ${this.alertCount ? `${this.alertCount} alert` : 'all watched'}
            </text>
          </g>
        `}

        <circle cx="50" cy="50" r="5.1" fill="var(--zs-clock-rim)"></circle>
        <circle cx="50" cy="50" r="3.4" fill="var(--zs-clock-center)"></circle>
        <circle cx="50" cy="50" r="1.2" fill="color-mix(in srgb, var(--zs-clock-accent) 68%, white)"></circle>
      </svg>
    `;
    }
    renderHand(wizard, index) {
        const rotation = this.getRotationForWizard(wizard);
        const tipY = 18;
        const labelRotation = rotation > 180 ? 180 : 0;
        return w `
      <g
        class="hand"
        style=${o({ transform: `rotate(${rotation}deg)` })}
        @click=${() => this.openMoreInfo(wizard.entityId)}
      >
        <path
          d="M 50 50 C 52.6 46.4, 54.2 37.2, 53.5 27.5 C 53 21.7, 51.6 18.8, 50 14.2 C 48.4 18.8, 47 21.7, 46.5 27.5 C 45.8 37.2, 47.4 46.4, 50 50 Z"
          fill=${wizard.color}
          stroke=${wizard.ringColor}
          stroke-width="0.35"
        ></path>
        <circle cx="50" cy=${tipY} r="4.3" fill=${wizard.color} stroke=${wizard.ringColor} stroke-width="0.55"></circle>
        ${wizard.avatar ? w `
          <clipPath id="avatar-clip-${index}">
            <circle cx="50" cy=${tipY} r="3.55"></circle>
          </clipPath>
          <image
            href=${wizard.avatar}
            x="46.35"
            y=${tipY - 3.65}
            width="7.3"
            height="7.3"
            preserveAspectRatio="xMidYMid slice"
            clip-path="url(#avatar-clip-${index})"
          ></image>
        ` : w `
          <text
            x="50"
            y=${tipY + 1.1}
            fill=${wizard.textColor}
            font-family="var(--zs-clock-title)"
            font-size="2.65"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            ${wizard.initials}
          </text>
        `}
        <g transform="translate(50 34) rotate(${labelRotation})">
          <text
            class="hand-label"
            text-anchor="middle"
            dominant-baseline="middle"
            fill=${wizard.textColor}
          >
            ${wizard.name}
          </text>
        </g>
      </g>
    `;
    }
    renderLegend() {
        if (this.config.style?.show_legend === false) {
            return '';
        }
        return b `
      <div class="legend">
        ${this.resolvedWizards.map((wizard) => b `
          <button
            class="legend-item"
            @click=${() => this.openMoreInfo(wizard.entityId)}
            title=${`Open ${wizard.name}`}
          >
            <div
              class="legend-seal"
              style=${o({
            background: wizard.color,
            color: wizard.textColor,
            border: `1px solid ${wizard.ringColor}`,
        })}
            >
              ${wizard.avatar ? b `<img src=${wizard.avatar} alt=${wizard.name} style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />` : wizard.initials}
            </div>
            <div class="legend-copy">
              <div class="legend-name">${wizard.name}</div>
              <div class="legend-place">${wizard.place.label}</div>
            </div>
          </button>
        `)}
      </div>
    `;
    }
    renderEmpty() {
        return b `
      <ha-card>
        <div class="shell">
          <div class="empty">Karta wymaga poprawnej konfiguracji miejsc i osób.</div>
        </div>
      </ha-card>
    `;
    }
    render() {
        if (!this.config) {
            return this.renderEmpty();
        }
        return b `
      <ha-card style=${o(this.computeCardStyle())}>
        <div class="backdrop"></div>
        <div class="shell">
          <div class="header">
            <div class="eyebrow">Wizard Presence</div>
            <div class="title">${this.config.title || 'Wizard Clock'}</div>
            ${this.config.subtitle ? b `<div class="subtitle">${this.config.subtitle}</div>` : ''}
          </div>
          <div class="clock-wrap">
            <div class="clock-frame">${this.renderDial()}</div>
          </div>
          ${this.renderLegend()}
        </div>
      </ha-card>
    `;
    }
}
ZSWizardClockCard.properties = {
    hass: { attribute: false },
    config: { attribute: false },
};
ZSWizardClockCard.styles = i$5 `
    :host {
      display: block;
      --zs-clock-card-bg: linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98));
      --zs-clock-text: #f8ecd2;
      --zs-clock-muted: rgba(248, 236, 210, 0.74);
      --zs-clock-accent: #d9b36e;
      --zs-clock-rim: #3c2412;
      --zs-clock-face: #efe1c3;
      --zs-clock-shadow: rgba(69, 39, 15, 0.34);
      --zs-clock-center: #5f3516;
      --zs-clock-size: min(76vw, 560px);
      --zs-clock-title: "Cinzel", "Cormorant Garamond", Georgia, serif;
      --zs-clock-copy: "Cormorant Garamond", Georgia, serif;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      padding: 24px;
      border-radius: 32px;
      background: var(--zs-clock-card-bg);
      color: var(--zs-clock-text);
      border: 1px solid color-mix(in srgb, var(--zs-clock-accent) 28%, transparent);
      box-shadow:
        0 26px 52px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .backdrop {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 15% 18%, rgba(255,255,255,0.14), transparent 22%),
        radial-gradient(circle at 80% 12%, rgba(255,220,152,0.15), transparent 20%),
        linear-gradient(135deg, transparent, rgba(255,255,255,0.04), transparent 70%);
      opacity: 0.95;
    }

    .shell {
      position: relative;
      display: grid;
      gap: 20px;
    }

    .header {
      display: grid;
      gap: 6px;
      justify-items: center;
      text-align: center;
    }

    .eyebrow {
      font-family: var(--zs-clock-copy);
      font-size: 0.9rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--zs-clock-muted);
    }

    .title {
      font-family: var(--zs-clock-title);
      font-size: clamp(1.8rem, 4vw, 2.7rem);
      letter-spacing: 0.05em;
      text-wrap: balance;
    }

    .subtitle {
      font-family: var(--zs-clock-copy);
      font-size: 1.08rem;
      color: var(--zs-clock-muted);
      text-wrap: balance;
    }

    .clock-wrap {
      display: grid;
      justify-items: center;
    }

    .clock-frame {
      width: var(--zs-clock-size);
      max-width: 100%;
      aspect-ratio: 1;
      filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.35));
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .place-label {
      font-family: var(--zs-clock-title);
      font-size: 3.1px;
      letter-spacing: 0.08em;
      fill: color-mix(in srgb, var(--zs-clock-rim) 80%, black);
      text-transform: uppercase;
    }

    .hand {
      transform-origin: 50px 50px;
      transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .hand-label {
      font-family: var(--zs-clock-copy);
      font-size: 3px;
      letter-spacing: 0.04em;
      pointer-events: none;
    }

    .legend {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .legend-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: 18px;
      background: rgba(255, 248, 230, 0.08);
      border: 1px solid rgba(255, 244, 217, 0.1);
      backdrop-filter: blur(10px);
      color: inherit;
      text-align: left;
      width: 100%;
      font: inherit;
      cursor: pointer;
      transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
    }

    .legend-item:hover {
      transform: translateY(-1px);
      background: rgba(255, 248, 230, 0.12);
      border-color: rgba(255, 244, 217, 0.18);
    }

    .legend-seal {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      overflow: hidden;
      display: grid;
      place-items: center;
      font-family: var(--zs-clock-title);
      font-size: 0.95rem;
      font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.24);
    }

    .legend-copy {
      min-width: 0;
      display: grid;
    }

    .legend-name {
      font-family: var(--zs-clock-title);
      font-size: 1.02rem;
      letter-spacing: 0.03em;
    }

    .legend-place {
      font-family: var(--zs-clock-copy);
      font-size: 1rem;
      color: var(--zs-clock-muted);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .empty {
      font-family: var(--zs-clock-copy);
      color: var(--zs-clock-muted);
      text-align: center;
      padding: 12px 0 4px;
    }

    @media (max-width: 640px) {
      ha-card {
        padding: 18px;
        border-radius: 24px;
      }

      .legend {
        grid-template-columns: 1fr;
      }
    }
  `;
customElements.define(CARD_TAG, ZSWizardClockCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: CARD_TAG,
    name: 'ZS Wizard Clock Card',
    preview: true,
    description: 'Elegant magical family location clock for Home Assistant',
    documentationURL: 'https://github.com/bwrwk/zs-wizard-clock-card',
});
//# sourceMappingURL=zs-wizard-clock-card.js.map

if(!self.define){let e,b={};const d=(d,a)=>(d=new URL(d+".js",a).href,b[d]||new Promise((b=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=b,document.head.appendChild(e)}else e=d,importScripts(d),b()})).then((()=>{let e=b[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(a,f)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(b[i])return;let s={};const r=e=>d(e,i),c={module:{uri:i},exports:s,require:r};b[i]=Promise.all(a.map((e=>c[e]||r(e)))).then((e=>(f(...e),s)))}}define(["./workbox-ad8011fb"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/binaries/stremio_core_web_bg.wasm",revision:"bca86abcbcbe7b4bc89b1c151b8a34c4"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/favicons/favicon.ico",revision:"4c07b4cdba0741908240aaf0f0996231"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/fonts/PlusJakartaSans.ttf",revision:"d42d5252438e0617f4fafe9c9b1eaa36"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/anonymous.png",revision:"14a3d1f35520016dfa7d524bc6fe00a3"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/background_1.svg",revision:"e13e8149bc3a081ae4b19a94339d0929"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/background_2.svg",revision:"7400a2bd6bd3a5b6ddf4d4cd12e6e1c8"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/default_avatar.png",revision:"71b1172926723433c6e5f94a1e570993"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/empty.png",revision:"3508ea0d8cd8dd84906ff960a356b6c9"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/icon.png",revision:"b23a3a2bbe761ce6029c564879702ad5"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/logo.png",revision:"a747ada078440d543890a24ea9105e6d"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/maskable_icon.png",revision:"941c7d6c4af30fd50d631032e31bbd42"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/images/stremio_symbol.png",revision:"c64dbb21f02e31bc644512327ed6fe80"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/screenshots/board_narrow.webp",revision:"8329eb909f925e3658dbb7d7e6611bd1"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/screenshots/board_wide.webp",revision:"506ccb23f4d5eced25b11331a10abacb"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/scripts/main.js",revision:"f34640423497fb08843a0599a01471fb"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/scripts/worker.js",revision:"def0e9f941167ca21a282bca99dfbdb6"},{url:"debb16c5a11bff972a877dd3b5e959e9703de96e/styles/main.css",revision:"89446054498a39b65c3623bf79976fef"},{url:"index.html",revision:"002e2b0ea617264e8e8ea2ff823afe46"}],{})}));
//# sourceMappingURL=service-worker.js.map

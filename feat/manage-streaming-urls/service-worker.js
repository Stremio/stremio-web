if(!self.define){let e,d={};const a=(a,c)=>(a=new URL(a+".js",c).href,d[a]||new Promise((d=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=d,document.head.appendChild(e)}else e=a,importScripts(a),d()})).then((()=>{let e=d[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(d[s])return;let r={};const n=e=>a(e,s),o={module:{uri:s},exports:r,require:n};d[s]=Promise.all(c.map((e=>o[e]||n(e)))).then((e=>(i(...e),r)))}}define(["./workbox-ad8011fb"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"869643973e3903d9c5a2183d60e8d08165c29570/binaries/stremio_core_web_bg.wasm",revision:"ef377cb1e36571687145b70d2b30a735"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/favicons/favicon.ico",revision:"4c07b4cdba0741908240aaf0f0996231"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/fonts/PlusJakartaSans.ttf",revision:"d42d5252438e0617f4fafe9c9b1eaa36"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/anonymous.png",revision:"14a3d1f35520016dfa7d524bc6fe00a3"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/background_1.svg",revision:"e13e8149bc3a081ae4b19a94339d0929"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/background_2.svg",revision:"7400a2bd6bd3a5b6ddf4d4cd12e6e1c8"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/default_avatar.png",revision:"71b1172926723433c6e5f94a1e570993"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/empty.png",revision:"3508ea0d8cd8dd84906ff960a356b6c9"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/icon.png",revision:"b23a3a2bbe761ce6029c564879702ad5"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/logo.png",revision:"a747ada078440d543890a24ea9105e6d"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/maskable_icon.png",revision:"941c7d6c4af30fd50d631032e31bbd42"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/images/stremio_symbol.png",revision:"c64dbb21f02e31bc644512327ed6fe80"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/screenshots/board_narrow.webp",revision:"8329eb909f925e3658dbb7d7e6611bd1"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/screenshots/board_wide.webp",revision:"506ccb23f4d5eced25b11331a10abacb"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/scripts/main.js",revision:"eef9e845b8d6d321f241aad0053d9a54"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/scripts/worker.js",revision:"4248e6e8fe8cb40c93a76d4adb87aa4c"},{url:"869643973e3903d9c5a2183d60e8d08165c29570/styles/main.css",revision:"843734e5bdde4c40704e7d3032420ec8"},{url:"index.html",revision:"b5bf6f5189bd59b93ffe7315f26fb6f8"}],{})}));
//# sourceMappingURL=service-worker.js.map

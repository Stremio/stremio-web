if(!self.define){let e,c={};const a=(a,f)=>(a=new URL(a+".js",f).href,c[a]||new Promise((c=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=c,document.head.appendChild(e)}else e=a,importScripts(a),c()})).then((()=>{let e=c[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(f,d)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(c[i])return;let b={};const s=e=>a(e,i),r={module:{uri:i},exports:b,require:s};c[i]=Promise.all(f.map((e=>r[e]||s(e)))).then((e=>(d(...e),b)))}}define(["./workbox-ad8011fb"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/binaries/stremio_core_web_bg.wasm",revision:"20f49a282872fda47122c2c2d033d47c"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/favicons/favicon.ico",revision:"4c07b4cdba0741908240aaf0f0996231"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/favicons/icon-96.png",revision:"38e4435de414019b7180d9118f2195ac"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/fonts/PlusJakartaSans.ttf",revision:"d42d5252438e0617f4fafe9c9b1eaa36"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/anonymous.png",revision:"193f37ff3cffb5847b4ba4d19277dea7"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/background_1.svg",revision:"e13e8149bc3a081ae4b19a94339d0929"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/background_2.svg",revision:"7400a2bd6bd3a5b6ddf4d4cd12e6e1c8"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/default_avatar.png",revision:"71b1172926723433c6e5f94a1e570993"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/empty.png",revision:"3508ea0d8cd8dd84906ff960a356b6c9"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/icon_x192.png",revision:"f0c07b7925b6b484e918fcb80d3be171"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/icon_x512.png",revision:"5232e0a400b4684441ee5843b6d6b926"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/logo.png",revision:"a747ada078440d543890a24ea9105e6d"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/maskable_icon_x192.png",revision:"2be489f0d46f54cf82ed6d3f2a46700d"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/maskable_icon_x512.png",revision:"b244fd1fd0b5dc7eeb9eeedcbc99273b"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/images/stremio_symbol.png",revision:"c64dbb21f02e31bc644512327ed6fe80"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/manifest.json",revision:"1577e844d5f40d9886332544c3e3a684"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/scripts/main.js",revision:"dded18d7c6c5da8ddd772fd78f6282d5"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/scripts/worker.js",revision:"f6c96aed16676d2a94ad8cda1a1ad0f4"},{url:"f7c100bce9c5e5ec019faa97413cf6ac279b4d7e/styles/main.css",revision:"1ff724e02b5a9bea1bf166a29f8ac89a"},{url:"index.html",revision:"d5296f0de9ee012be59910559da159d7"}],{})}));
//# sourceMappingURL=service-worker.js.map

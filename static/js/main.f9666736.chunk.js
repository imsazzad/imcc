(this.webpackJsonpimcc=this.webpackJsonpimcc||[]).push([[0],[,,,,function(e,t,a){e.exports=a.p+"static/media/imcc.6aad882c.svg"},function(e,t,a){e.exports=a(16)},,,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(3),l=a.n(c),o=(a(14),a(15),a(4)),i=a.n(o);var s=function(){const[e,t]=Object(n.useState)(null),[a,c]=Object(n.useState)(new Date);Object(n.useEffect)(()=>{const e=new Date,a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");fetch(`/imcc/prayertime/${a}/${n+".json"}`).then(e=>e.json()).then(e=>t(e)).catch(e=>console.error("Error fetching data:",e))},[]),Object(n.useEffect)(()=>{const e=setInterval(()=>{c(new Date)},1e3);return()=>clearInterval(e)},[]);const l=a.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),o=a.toLocaleDateString("en-GB-u-ca-islamic",{day:"numeric",month:"long",year:"numeric"}),s=(()=>{if(!e)return-1;const t=a.toTimeString().split(" ")[0],n=t.split(":").reduce((e,t)=>60*e+ +t);console.log("currentTimeString",t);for(let a=0;a<e.rows.length;a++){const t=e.rows[a][1];console.log("rowTimeString",t);const r=t.split(":").reduce((e,t)=>60*e+ +t);if(console.log("rowTimeInSeconds",r,"currentTimeInSeconds",n),r>n)return a}return-1})();return console.log("Next time index:",s),e?r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"App-header"},r.a.createElement("img",{src:i.a,alt:"IMCC Logo",className:"logo"}),r.a.createElement("div",{className:"date-english"},l),r.a.createElement("div",{className:"current-time"},a.toLocaleTimeString()),r.a.createElement("div",{className:"date-arabic"},o)),r.a.createElement("main",{className:"App-main"},r.a.createElement("table",{className:"App-table"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,e.header1),r.a.createElement("th",null,e.header2),e.header3&&r.a.createElement("th",null,e.header3))),r.a.createElement("tbody",null,e.rows.map((t,a)=>r.a.createElement("tr",{key:a,className:a===s?"bold-row":""},r.a.createElement("td",{"data-label":e.header1},t[0]),r.a.createElement("td",{"data-label":e.header2},t[1]),t[2]&&r.a.createElement("td",{"data-label":e.header3},t[2]))))))):r.a.createElement("div",null,"Loading...")};var m=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,17)).then(t=>{let{getCLS:a,getFID:n,getFCP:r,getLCP:c,getTTFB:l}=t;a(e),n(e),r(e),c(e),l(e)})};l.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(s,null))),m()}],[[5,1,2]]]);
//# sourceMappingURL=main.f9666736.chunk.js.map
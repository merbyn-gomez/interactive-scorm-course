"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const html=fs.readFileSync(path.resolve(__dirname,"..","index.html"),"utf8");
const script=html.match(/<script id="course-app">([\s\S]*?)<\/script>/);
assert(script,"Embedded JS missing");
const elements=new Map(), events={},calls=[],stored={};
for(const id of ["nav","progress-text","progress-fill","progress","where","status","connection","content"]){
 elements.set(id,{innerHTML:"",textContent:"",style:{},setAttribute(){},focus(){}});
}
const api={
 LMSInitialize(){calls.push(["initialize"]);return "true"},
 LMSGetValue(key){return key==="cmi.core.lesson_status"?"not attempted":""},
 LMSSetValue(key,value){calls.push([key,value]);return "true"},
 LMSCommit(){return "true"},
 LMSFinish(){calls.push(["finish"]);return "true"}
};
const window={API:api,opener:null,scrollTo(){},print(){},addEventListener(type,callback){events["win:"+type]=callback}};
window.parent=window;
const document={getElementById(id){return elements.get(id)},addEventListener(type,callback){events[type]=callback},querySelector(){return {value:"1"}}};
const context={window,document,localStorage:{getItem(k){return stored[k]||null},setItem(k,v){stored[k]=v}},alert(){},Date,Math,JSON,Number,String,console};
vm.createContext(context);vm.runInContext(script[1],context);
assert(elements.get("content").innerHTML.includes("Comenzar el curso"));
function click(dataset){events.click({target:{closest(){return {dataset}}}})}
for(const id of ["indicadores","calculos","decisiones","evaluacion"]){click({go:id});assert(elements.get("content").innerHTML.length>100)}
for(const [i,answer] of [1,2,0,2,1].entries()){events.change({target:{dataset:{answer:String(i)},value:String(answer)}})}
click({submit:"1"});
assert(elements.get("content").innerHTML.includes("100 %"));
assert(calls.some(x=>x[0]==="cmi.core.lesson_status"&&x[1]==="passed"));
assert(calls.some(x=>x[0]==="cmi.core.score.raw"&&x[1]==="100"));
assert(JSON.parse(stored["merbyn-scorm-indicators-v1"]).passed);
events["win:pagehide"]();
assert(calls.some(x=>x[0]==="finish"));
console.log("PASS: navigation, five-question quiz, local progress and SCORM mock API writes");

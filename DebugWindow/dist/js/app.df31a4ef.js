(function(e){function t(t){for(var o,i,c=t[0],u=t[1],s=t[2],f=0,p=[];f<c.length;f++)i=c[f],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&p.push(a[i][0]),a[i]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);l&&l(t);while(p.length)p.shift()();return r.push.apply(r,s||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,c=1;c<n.length;c++){var u=n[c];0!==a[u]&&(o=!1)}o&&(r.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={app:0},r=[];function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var s=0;s<c.length;s++)t(c[s]);var l=u;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("ecfe")},"03d3":function(e,t,n){"use strict";n("9ea0")},"330d":function(e,t,n){"use strict";n("9108")},"4faa":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o,a,r=n("2b0e"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("Main")],1)},c=[],u=n("5c96"),s=n.n(u),l=(n("0fae"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"main"}},[n("el-tabs",{attrs:{type:"card"},model:{value:e.nav,callback:function(t){e.nav=t},expression:"nav"}},[n("el-tab-pane",{attrs:{label:"调试",name:"environment"}},[n("MainTree")],1)],1)],1)}),f=[],p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"MainTree"}},[n("TreeNode",{attrs:{parent:e.TreeTool.getDebugDataRoot(),depath:0,name:e.TreeTool.getDebugDataRootKey()},on:{update:e.update}})],1)},d=[],h=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.ifShow&&e.ifCom?n("div",{staticClass:"tree_node"},[n("div",{staticClass:"name",class:e.depth%2==0?"odd":"plural",style:{paddingLeft:20*e.depth+"px"},on:{click:function(t){e.show=!e.show}}},[n("div",{staticClass:"title"},["object"==typeof e.node?n("i",{class:e.show?"el-icon-caret-bottom":"el-icon-caret-right"}):e._e(),n("div",{staticClass:"name1",class:{protoName:"__proto__"==e.name}},[e._v(" "+e._s(e.name)+" ")]),n("div",{staticClass:"name2"},[e._v(e._s(e.TreeTool.getClassName(e.node)))])]),"string"!=typeof e.node||e.ifFake?e._e():n("div",{staticClass:"child_content"},[n("el-input",{attrs:{size:"mini"},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1),"number"!=typeof e.node||e.ifFake?e._e():n("div",{staticClass:"child_content"},[n("el-input-number",{attrs:{size:"mini"},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1),"boolean"!=typeof e.node||e.ifFake?e._e():n("div",{staticClass:"child_content"},[n("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1),n("el-button",{staticClass:"child_content",attrs:{icon:"el-icon-search",circle:"",size:"mini"},on:{click:e.cheshi}}),e.ifFake?n("div",{staticClass:"fake"},[e._v(" 只读: "+e._s("object"!=typeof e.node?e.value:"")+" ")]):e._e()],1),e.show&&"object"==typeof e.node?n("div",{staticClass:"child_node"},e._l(e.TreeTool.getKeys(e.node),(function(t,o){return n("TreeNode",{key:o,attrs:{depth:e.depth+1,parent:"__proto__"==e.name?e.parent:e.node,name:t},on:{update:e.updateEmit}})})),1):e._e()]):e._e()},b=[],m=(n("b0c0"),n("a9e3"),n("53ca")),v=(n("4de4"),n("a630"),n("7039"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0"),n("c740"),n("ac1f"),n("25f0"),n("466d"),n("2909")),_=[];function y(e,t){var n=[];return g(e,n,t),n=Array.from(new Set(n)),n}function g(e,t,n){if("object"==Object(m["a"])(e)){var o=Object.getOwnPropertyNames(e);o=o.filter((function(e){return-1==_.findIndex((function(t){return t==e}))})),n&&(o=o.filter((function(t){return n(t,e)}))),t.push.apply(t,Object(v["a"])(o)),e["__proto__"]&&g(e["__proto__"],t,n)}}function w(e){if(e&&e.constructor&&e.constructor.toString()){if(e.constructor.name)return e.constructor.name;var t,n=e.constructor.toString();if(t="["==n.charAt(0)?n.match(/\w+\s∗(\w+)\w+\s∗(\w+)/):n.match(/function\s*(\w+)/),t&&2==t.length)return t[1]}}function j(e){var t=!0,n=!0;return y(e,(function(e,o){t=!0,n=!0;try{"undefined"!=typeof o[e]&&(t="function"!=typeof o[e])}catch(a){t=!1,console.log("有一个键获取值时出错了",e,o)}return n=!/^_/.test(e),Object(m["a"])(t)&&n}))}function O(e){var t=Object.getOwnPropertyNames(e);return t=t.filter((function(t){var n=!0;try{("function"==typeof e[t]||/^_/.test(t))&&(n=!1)}catch(o){n=!1}return n})),"object"==Object(m["a"])(e)&&e["__proto__"]&&t.push("__proto__"),t=Array.from(new Set(t)),t}function T(){return window.opener||(window.opener={}),window.opener}function k(){return"$Debug"}(o=_).push.apply(o,Object(v["a"])(Object.getOwnPropertyNames(Object))),(a=_).push.apply(a,Object(v["a"])(Object.getOwnPropertyNames(Array))),_.push("__proto__"),_=Array.from(new Set(_));var x={getDebugDataRoot:T,getDebugDataRootKey:k,getDebugData:function(){if(!T()[k()]){var e={get a(){return 10}},t=Object.create(e),n=new Proxy({a:1,b:2},{});console.log(t);var o={};Object.defineProperty(o,"x",{value:{a:1,b:2},writable:!1,enumerable:!1,configurable:!0}),Object.defineProperty(o,"y",{value:{a:2,b:4},writable:!0,enumerable:!1,configurable:!0});var a=function e(){this.null=void 0,this.anotherObj={a:t},this.ap=n,this.o=o,this._a=0,this.boole=!0,this.a=1,this.b=2,e.prototype.c=3,e.prototype.d=4,e.prototype.f=function(){console.log("f")},e.prototype.e={g:1,x:0,boole:!1}};T()[k()]=new a,console.log(T()[k()])}return T()[k()]},getAllKeys:j,getKeys:O,getClassName:w,ifShowKey:function(e,t){try{var n=e[t];e[t]=n}catch(o){return!1}return!0}},D=x,N={name:"TreeNode",props:{parent:{type:[Object,Array],default:function(){return{}}},name:{type:[String,Number],default:""},depth:{type:Number,default:0}},data:function(){return{updateNumber:1,TreeTool:D,show:!1,value:"",ifFake:!1,ifCom:!1}},computed:{ifShow:function(){return"object"!=Object(m["a"])(this.node)||D.getKeys(this.node).length>0},node:function(){return this.updateNumber>0?this.ifFake?this.$Fakedata:this.parent[this.name]:null}},watch:{value:function(){this.$emit("update",this.name,this.value,!0,this.ifFake),this.updateNumber++},show:function(){this.updateNumber++}},methods:{cheshi:function(){console.log(this),console.log(this.node),console.log(this.$Fakedata),console.log(this.parent,this.name,this.parent[this.name])},updateEmit:function(e,t,n,o){this.ifCom&&(o?this.$Fakedata=this.node:this.parent[this.name][e]=n?t:this.parent[this.name][e],this.$emit("update",this.name,this.parent[this.name],!1,this.ifFake),this.updateNumber++)}},mounted:function(){var e=this;this.TreeTool.ifShowKey(this.parent,this.name)||(this.$Fakedata=this.node,this.ifFake=!0),"object"!=Object(m["a"])(this.node)&&(this.value=this.node),this.updateNumber++,setTimeout((function(){e.ifCom=!0}),10)}},C=N,S=(n("03d3"),n("0c7c")),P=Object(S["a"])(C,h,b,!1,null,"1ac5ce85",null),F=P.exports,$={name:"MainTree",components:{TreeNode:F},data:function(){return{TreeTool:D,data:{}}},methods:{update:function(e){D.getDebugDataRoot()[e]=D.getDebugDataRoot()[e],this.data=D.getDebugDataRoot()[e]}},mounted:function(){this.data=this.TreeTool.getDebugData()}},M=$,A=(n("330d"),Object(S["a"])(M,p,d,!1,null,"84c9598c",null)),K=A.exports,R={name:"HelloWorld",components:{MainTree:K},data:function(){return{nav:"environment"}}},E=R,z=(n("5779"),Object(S["a"])(E,l,f,!1,null,"14b1cb17",null)),J=z.exports;r["default"].use(s.a);var H={name:"App",components:{Main:J}},I=H,L=(n("034f"),Object(S["a"])(I,i,c,!1,null,null,null)),W=L.exports;r["default"].config.productionTip=!1,new r["default"]({render:function(e){return e(W)}}).$mount("#app")},5779:function(e,t,n){"use strict";n("4faa")},9108:function(e,t,n){},"9ea0":function(e,t,n){},ecfe:function(e,t,n){}});
//# sourceMappingURL=app.df31a4ef.js.map
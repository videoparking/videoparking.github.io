(this["webpackJsonpfirst-blood-part-ii"]=this["webpackJsonpfirst-blood-part-ii"]||[]).push([[0],{121:function(t,e,n){"use strict";n.r(e);var o=n(4),a=n(8),c=n.n(a),r=n(43),i=n.n(r),s=(n(51),n(15)),l=n.n(s),u=n(10),d=n(45),p=n(19),h=(n(53),n(20)),f=n.n(h),b=f.a.create({baseURL:"https://ib9m7jp63g.execute-api.eu-central-1.amazonaws.com/dev/"}),m=n(11),v=n(12),j=n(14),x=n(13),g=n(6),y=function(t){Object(j.a)(n,t);var e=Object(x.a)(n);function n(){var t;Object(m.a)(this,n);for(var o=arguments.length,a=new Array(o),c=0;c<o;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).state={image:null,error:void 0},t.handleLoad=function(){t.setState({image:t.image,error:void 0})},t.handleError=function(e){t.setState({error:"Loading..."})},t}return Object(v.a)(n,[{key:"componentDidMount",value:function(){this.loadImage()}},{key:"componentDidUpdate",value:function(t){t.src!==this.props.src&&this.loadImage()}},{key:"componentWillUnmount",value:function(){this.image.removeEventListener("load",this.handleLoad)}},{key:"loadImage",value:function(){this.image=new window.Image,this.image.src=this.props.src,this.image.addEventListener("load",this.handleLoad),this.image.addEventListener("error",this.handleError)}},{key:"render",value:function(){var t=this;return void 0!=this.state.error?Object(o.jsx)(g.Text,{text:this.state.error,fontSize:20,fill:"red"}):Object(o.jsx)(g.Image,{x:0,y:0,image:this.state.image,scaleX:this.props.scale,scaleY:this.props.scale,ref:function(e){t.imageNode=e}})}}]),n}(c.a.Component),O=f.a.create({baseURL:"/zones-data/v1/"}),w=console.log;function k(){return(k=Object(p.a)(l.a.mark((function t(e){var n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,O.get("".concat(e,"/zones-v1.json"));case 2:return n=t.sent,console.log("response:",n),t.abrupt("return",n.data);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function S(t){var e={};return t.map((function(t){return e[t.zone]=t})),e}var T=function(t){Object(j.a)(n,t);var e=Object(x.a)(n);function n(){var t;Object(m.a)(this,n);for(var o=arguments.length,a=new Array(o),c=0;c<o;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).state={zones:[],stats:S(t.props.stats)},t}return Object(v.a)(n,[{key:"componentDidMount",value:function(){this.loadZones()}},{key:"componentDidUpdate",value:function(t){t.location!==this.props.location?this.loadZones():t.stats!==this.props.stats&&this.setState(Object(u.a)(Object(u.a)({},this.state),{},{stats:S(this.props.stats)}))}},{key:"componentWillUnmount",value:function(){}},{key:"loadZones",value:function(){var t=this;(function(t){return k.apply(this,arguments)})(this.props.location).then((function(e){w(e),t.setState({zones:e.zones,stats:S(t.props.stats)})})).catch((function(e){console.log("ERROR:",e),t.setState({zones:[]})}))}},{key:"drawPolygon",value:function(t){var e=this,n=function(t){return t*e.props.scale};return function(e){if(t){var o=t.polygon;e.beginPath(),e.moveTo(n(o[0][0]),n(o[0][1]));for(var a=1;a<o.length;a++)e.lineTo(n(o[a][0]),n(o[a][1]));e.closePath(),e.fillStrokeShape(this)}else console.log("no zones to preview")}}},{key:"info",value:function(t){if(this.state.stats){var e=this.state.stats[t];return e?"".concat(t," ").concat(e.last_detected_cars,"/").concat(e.max_detected_cars):t}}},{key:"render",value:function(){var t=this;return this.state.zones.map((function(e){return Object(o.jsxs)(g.Group,{x:0,y:0,children:[Object(o.jsx)(g.Text,{text:t.info(e.name),x:3+e.polygon[0][0]*t.props.scale,y:e.polygon[0][1]*t.props.scale,fontSize:10,fill:t.props.color}),Object(o.jsx)(g.Shape,{stroke:t.props.color,strokeWidth:1,sceneFunc:t.drawPolygon(e)})]},e.name)}))}}]),n}(c.a.Component),_=function(t){Object(j.a)(n,t);var e=Object(x.a)(n);function n(){var t;Object(m.a)(this,n);for(var o=arguments.length,a=new Array(o),c=0;c<o;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).state={detections:t.props.detections.map((function(e){return t.norm(e)}))},t}return Object(v.a)(n,[{key:"componentDidMount",value:function(){}},{key:"componentDidUpdate",value:function(t){var e=this;if(t.detections!==this.props.detections){var n=this.props.detections.map((function(t){return e.norm(t)}));this.setState({detections:n})}}},{key:"componentWillUnmount",value:function(){}},{key:"norm",value:function(t){return{object:t.object,confidence:parseFloat(t.measure_value),bbox:{x:parseInt(t.att_x)+parseInt(t.bbox_x)-parseInt(t.bbox_w)/2,y:parseInt(t.att_y)+parseInt(t.bbox_y)-parseInt(t.bbox_h)/2,width:parseInt(t.bbox_w),height:parseInt(t.bbox_h)}}}},{key:"scaled",value:function(t){return t*this.props.scale}},{key:"render",value:function(){var t=this;return this.state.detections.map((function(e){return Object(o.jsxs)(g.Group,{x:t.scaled(e.bbox.x),y:t.scaled(e.bbox.y),children:[Object(o.jsx)(g.Text,{text:e.object+" "+e.confidence.toFixed(2),x:3,fontSize:10,fill:t.props.color}),Object(o.jsx)(g.Rect,{width:t.scaled(e.bbox.width),height:t.scaled(e.bbox.height),stroke:t.props.color,strokeWidth:1})]},e.confidence)}))}}]),n}(c.a.Component),z=n(44),I=console.log,L=["8f38301f7f70d7d1/1","a07345b2737af5f/1"];function D(){return(D=Object(p.a)(l.a.mark((function t(e){var n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b.get("view?location=".concat(e));case 2:return n=t.sent,console.log("response:",n),t.abrupt("return",n.data);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function E(){return Math.max(document.documentElement.clientWidth||0,window.innerWidth||0)}function P(){return Math.max(document.documentElement.clientHeight||0,window.innerHeight||0)}var W=function(){var t=Object(a.useState)({picSrc:void 0,firstPic:!0,location:L[0],vw:E(),vh:P(),scale:.25,detections:[],stats:[]}),e=Object(d.a)(t,2),n=e[0],c=e[1],r=function(t,e){var n=function(t){var e=t/60;return Math.max(0,Math.min(100,100-25*e))}(((new Date).getTime()-new Date(e).getTime())/1e3-65);return{backgroundImage:"url(".concat(t,")"),backgroundColor:"#282c34",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundAttachment:"fixed",backgroundPosition:"center",filter:"blur(".concat(0,"px) saturate(").concat(n,"%)")}},i=function(){(function(t){return D.apply(this,arguments)})(n.location).then((function(t){I(t);var e=t.duration?t.duration:60,o=t.url,a=t.frameTime,i=r(o,a),s=Object(u.a)(Object(u.a)({},n),{},{picSrc:o,firstPic:!1,duration:e,frameTime:a,style:i,vw:E(),vh:P(),detections:t.detections||[],stats:t.stats||[]});console.log(s),c(s),document.title=t.message+", parking at ".concat(n.location," ").concat(new Date(a))})).catch((function(t){console.log(t);var e=r(n.picSrc,n.frameTime),o=n.retries?n.retries+1:0;c(Object(u.a)(Object(u.a)({},n),{},{picSrc:n.picSrc,firstPic:!1,duration:30,style:e,retries:o,vw:E(),vh:P(),detections:[],stats:[]})),document.title="Retrying (".concat(o,")")+(n.frameTime?" from ".concat(n.frameTime," ..."):"...")}))};Object(a.useEffect)((function(){var t=n.firstPic?0:n.duration;console.log("Timeout till renew:",t);var e=setTimeout(i,1e3*t);return function(){return clearTimeout(e)}}));var s=Object(z.useDoubleTap)((function(t){!function(){var t=(L.indexOf(n.location)+1)%L.length,e=L[t];console.log("location:",e),c(Object(u.a)(Object(u.a)({},n),{},{firstPic:!0,location:e,vw:E(),vh:P()}))}(),console.log("Double tapped")}));return Object(o.jsx)("div",Object(u.a)(Object(u.a)({className:"App"},s),{},{children:Object(o.jsx)("div",{className:"App-header",children:Object(o.jsxs)(g.Stage,{width:n.vw,height:n.vh,style:{backgroundColor:"dimgray"},children:[Object(o.jsx)(g.Layer,{children:Object(o.jsx)(y,{src:n.picSrc,scale:n.scale})}),Object(o.jsx)(g.Layer,{children:Object(o.jsx)(T,{location:n.location,stats:n.stats,scale:n.scale,color:"magenta"})}),Object(o.jsx)(g.Layer,{children:Object(o.jsx)(_,{detections:n.detections,scale:n.scale,color:"yellow"})}),Object(o.jsxs)(g.Layer,{children:[Object(o.jsx)(g.Group,{x:n.vw-200,y:3,children:Object(o.jsx)(g.Text,{text:"Info:\n  screen: ".concat(n.vw,"x").concat(n.vh,"\n  scale: ").concat(n.scale,"\n  location: ").concat(n.location,"\n  frame time: ").concat(n.frameTime,"\n  detections: ").concat(n.detections.length,"\n  zones:\n    ")+n.stats.map((function(t){return"".concat(t.zone,": ").concat(t.last_detected_cars,"/").concat(t.max_detected_cars," [max of ").concat(t.period_for_max,"]")})).join("\n    "),fontSize:10,fill:"lawngreen"})}),Object(o.jsx)(g.Group,{x:n.vw-180,y:n.vh-30,children:Object(o.jsx)(g.Text,{text:"Help:\n  - Double-tap to select next location\n",fontSize:10,fill:"black"})})]})]})})}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(Object(o.jsx)(c.a.StrictMode,{children:Object(o.jsx)(W,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))},51:function(t,e,n){},53:function(t,e,n){}},[[121,1,2]]]);
//# sourceMappingURL=main.a3873f4b.chunk.js.map
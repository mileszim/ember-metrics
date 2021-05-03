import { assign } from '@ember/polyfills';
import { debug } from '@ember/debug';
import { without, compact, isPresent } from '../utils/object-transforms';
import removeFromDOM from '../utils/remove-from-dom';
import BaseAdapter from './base';

export default class Ahoy extends BaseAdapter {
  toStringExtension() {
    return 'Ahoy';
  }

  init() {
    // const config = assign({}, this.config);

    // assert(`[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`, segmentKey);

    // start of ahoy loading snippet

    /* eslint-disable no-console */

    // Create a queue, but don't obliterate an existing one!
    let ahoy = window.ahoy = window.Ahoy || [];

    // If the real analytics.js is already on the page return.
    if (ahoy.ready) return;

    // // If the snippet was invoked already show an error
    // if (analytics.invoked) {
    //   if (window.console && console.error) {
    //     console.error('Segment snippet included twice.');
    //   }
    //   return;
    // }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    // analytics.invoked = true;

    // A list of the methods in Ahoy.js to stub.
    ahoy.methods = [
      'configure',
      'ready',
      'getVisitId',
      'getVisitorId',
      'reset',
      'debug',
      'track',
      'trackView',
      'trackClicks',
      'trackSubmits',
      'trackChanges',
      'trackAll',
      'start'
    ];

    // Define a factory to create stubs. These are placeholders
    // for methods in Ahoy.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    ahoy.factory = function(method){
      return function(){
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        ahoy.push(args);
        return ahoy;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < ahoy.methods.length; i++) {
      var key = ahoy.methods[i];
      ahoy[key] = ahoy.factory(key);
    }

    // Define a method to load Ahoy.js from our CDN,
    // and that will be sure to only ever load it once.
    ahoy.load = function(key, options){
      // Create an async script element based on your key.
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://unpkg.com/ahoy.js@'
        + key + '/dist/ahoy.js';

      // Insert our script next to the first script element.
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      ahoy._loadOptions = options;
    };

    // Add a version to keep track of what's in the wild.
    ahoy.SNIPPET_VERSION = '0.3.8';

    // Load Ahoy.js with your key, which will automatically
    // load the tools you've enabled for your account.
    ahoy.load(ahoy.SNIPPET_VERSION);

    /* eslint-enable no-console */

    // end of ahoy loading snippet

   const config = assign({
      urlPrefix: "",
      visitsUrl: "/ahoy/visits",
      eventsUrl: "/ahoy/events",
      page: null,
      platform: "Web",
      useBeacon: true,
      startOnReady: false,
      trackVisits: true,
      cookies: true,
      cookieDomain: null,
      headers: {},
      visitParams: {},
      withCredentials: true,
      visitDuration: 4 * 60, // 4 hours
      visitorDuration: 2 * 365 * 24 * 60 // 2 years
    }, this.config);

    const { enableDebugger } = config;
    delete config.enableDebugger;

    // start Ahoy.js
    // window.ahoy.start();

    // Configure Ahoy.js
    ahoy.configure(config);

    // Enable Debugging
    if (enableDebugger) {
      ahoy.debug();
      debug(`[ember-metrics] Ahoy.js debugger enabled`);
    }

    // Establish initial visit to find or create visit_token and visitor_token
    this.trackEvent({ event: "ahoy_initialized" });
  }

  // init() {
  //   const config = assign({
  //     urlPrefix: "",
  //     visitsUrl: "/ahoy/visits",
  //     eventsUrl: "/ahoy/events",
  //     page: null,
  //     platform: "Web",
  //     useBeacon: true,
  //     startOnReady: false,
  //     trackVisits: true,
  //     cookies: true,
  //     cookieDomain: null,
  //     headers: {},
  //     visitParams: {},
  //     withCredentials: true,
  //     visitDuration: 4 * 60, // 4 hours
  //     visitorDuration: 2 * 365 * 24 * 60 // 2 years
  //   }, this.config);

  //   const { enableDebugger } = config;
  //   delete config.enableDebugger;

  //   /* eslint-disable */
  //   /* minified src: https://unpkg.com/ahoy.js@0.3.8/dist/ahoy.js */
  //   !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).ahoy=e()}(this,function(){"use strict";var t=function(t){return void 0===t},e=function(t){return Array.isArray(t)},
  //   n=function(t){return t&&"number"==typeof t.size&&"string"==typeof t.type&&"function"==typeof t.slice},i=function(r,o,a,s){return(o=o||{}).indices=!t(o.indices)&&o.indices,o.nullsAsUndefineds=!t(o.nullsAsUndefineds)&&o.nullsAsUndefineds,o.booleansAsIntegers=!t(o.booleansAsIntegers)&&o.booleansAsIntegers,o.allowEmptyArrays=!t(o.allowEmptyArrays)&&o.allowEmptyArrays,
  //   a=a||new FormData,t(r)?a:(null===r?o.nullsAsUndefineds||a.append(s,""):!function(t){return"boolean"==typeof t}(r)?e(r)?r.length?r.forEach(function(t,e){var n=s+"["+(o.indices?e:"")+"]";i(t,o,a,n)}):o.allowEmptyArrays&&a.append(s+"[]",""):!function(t){return t instanceof Date}(r)?!function(t){return t===Object(t)}(r)||function(t){return n(t)&&"string"==typeof t.name&&("object"==typeof t.lastModifiedDate||"number"==typeof t.lastModified)}(r)||n(r)?a.append(s,r):Object.keys(r).forEach(function(t){var n=r[t];if(e(n))for(;t.length>2&&t.lastIndexOf("[]")===t.length-2;)t=t.substring(0,
  //   t.length-2);i(n,o,a,s?s+"["+t+"]":t)}):a.append(s,r.toISOString()):o.booleansAsIntegers?a.append(s,r?1:0):a.append(s,r),a)},r={serialize:i}.serialize,o={set:function(t,e,n,i){var r="",o="";if(n){var a=new Date;a.setTime(a.getTime()+60*n*1e3),r="; expires="+a.toGMTString()}i&&(o="; domain="+i),document.cookie=t+"="+escape(e)+r+o+"; path=/"},get:function(t){var e,n,i=t+"=",
  //   r=document.cookie.split(";");for(e=0;e<r.length;e++){for(n=r[e];" "===n.charAt(0);)n=n.substring(1,n.length);if(0===n.indexOf(i))return unescape(n.substring(i.length,n.length))}return null}},a={urlPrefix:"",visitsUrl:"/ahoy/visits",eventsUrl:"/ahoy/events",page:null,platform:"Web",
  //   useBeacon:!0,startOnReady:!0,trackVisits:!0,cookies:!0,cookieDomain:null,headers:{},visitParams:{},withCredentials:!1,visitDuration:240,visitorDuration:1051200},s=window.ahoy||window.Ahoy||{};s.configure=function(t){for(var e in t)t.hasOwnProperty(e)&&(a[e]=t[e])},s.configure(s);var c,u,f,d,l=window.jQuery||window.Zepto||window.$,h=!1,
  //   v=[],p="undefined"!=typeof JSON&&void 0!==JSON.stringify,y=[];function g(){return a.urlPrefix+a.eventsUrl}function m(){return(a.useBeacon||a.trackNow)&&(t=a.headers,0===Object.keys(t).length)&&p&&void 0!==window.navigator.sendBeacon&&!a.withCredentials;var t}function k(t,
  //   e,n){o.set(t,e,n,a.cookieDomain||a.domain)}function w(t){return o.get(t)}function x(t){o.set(t,"",-1)}function b(t){w("ahoy_debug")&&window.console.log(t)}function _(){for(var t;t=v.shift();)t();h=!0}function S(t,e,n){document.addEventListener(t,function(t){var i=function t(e,n){var i=e.matches||e.matchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector;return i?i.apply(e,[n])?e:e.parentElement?t(e.parentElement,
  //   n):null:(b("Unable to match"),null)}(t.target,e);i&&n.call(i,t)})}function O(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)})}function A(){a.cookies&&p&&k("ahoy_events",JSON.stringify(y),1)}function C(){var t=document.querySelector("meta[name=csrf-token]");return t&&t.content}function T(t){var e=C();e&&t.setRequestHeader("X-CSRF-Token",e)}function V(t,e,n){if(p)if(l&&l.ajax)l.ajax({type:"POST",url:t,data:JSON.stringify(e),
  //   contentType:"application/json; charset=utf-8",dataType:"json",beforeSend:T,success:n,headers:a.headers,xhrFields:{withCredentials:a.withCredentials}});else{var i=new XMLHttpRequest;for(var r in i.open("POST",t,!0),i.withCredentials=a.withCredentials,i.setRequestHeader("Content-Type","application/json"),a.headers)a.headers.hasOwnProperty(r)&&i.setRequestHeader(r,a.headers[r]);i.onload=function(){200===i.status&&n()},T(i),
  //   i.send(JSON.stringify(e))}}function j(t){var e={events:[t]};return a.cookies&&(e.visit_token=t.visit_token,e.visitor_token=t.visitor_token),delete t.visit_token,delete t.visitor_token,e}function P(t){s.ready(function(){V(g(),j(t),function(){for(var e=0;e<y.length;e++)if(y[e].id==t.id){y.splice(e,1);break}A()})})}function I(t){s.ready(function(){var e,n=j(t),i=(e=document.querySelector("meta[name=csrf-param]"))&&e.content,o=C();i&&o&&(n[i]=o),n.events_json=JSON.stringify(n.events),delete n.events,window.navigator.sendBeacon(g(),
  //   r(n))})}function D(){return a.page||window.location.pathname}function M(t){return t&&t.length>0?t:null}function N(t){return function(t){for(var e in t)t.hasOwnProperty(e)&&null===t[e]&&delete t[e];return t}({tag:this.tagName.toLowerCase(),id:M(this.id),class:M(this.className),page:D(),section:E(this)})}function E(t){for(;t&&t!==document;t=t.parentNode)if(t.hasAttribute("data-section"))return t.getAttribute("data-section");return null}function U(){if(h=!1,c=s.getVisitId(),u=s.getVisitorId(),
  //   f=w("ahoy_track"),!1===a.cookies||!1===a.trackVisits)b("Visit tracking disabled"),_();else if(c&&u&&!f)b("Active visit"),_();else if(c||k("ahoy_visit",c=O(),a.visitDuration),w("ahoy_visit")){b("Visit started"),u||k("ahoy_visitor",u=O(),a.visitorDuration);var t={visit_token:c,visitor_token:u,platform:a.platform,landing_page:window.location.href,screen_width:window.screen.width,screen_height:window.screen.height,js:!0};for(var e in document.referrer.length>0&&(t.referrer=document.referrer),a.visitParams)a.visitParams.hasOwnProperty(e)&&(t[e]=a.visitParams[e]);b(t),
  //   V(a.urlPrefix+a.visitsUrl,t,function(){x("ahoy_track"),_()})}else b("Cookies disabled"),_()}s.ready=function(t){h?t():v.push(t)},s.getVisitId=s.getVisitToken=function(){return w("ahoy_visit")},s.getVisitorId=s.getVisitorToken=function(){return w("ahoy_visitor")},s.reset=function(){return x("ahoy_visit"),x("ahoy_visitor"),x("ahoy_events"),x("ahoy_track"),!0},s.debug=function(t){return!1===t?x("ahoy_debug"):k("ahoy_debug","t",525600),!0},s.track=function(t,e){var n={name:t,properties:e||{},
  //   time:(new Date).getTime()/1e3,id:O(),js:!0};return s.ready(function(){a.cookies&&!s.getVisitId()&&U(),s.ready(function(){b(n),n.visit_token=s.getVisitId(),n.visitor_token=s.getVisitorId(),m()?I(n):(y.push(n),A(),setTimeout(function(){P(n)},1e3))})}),!0},s.trackView=function(t){var e={url:window.location.href,title:document.title,page:D()};if(t)for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);s.track("$view",e)},s.trackClicks=function(){S("click","a, button, input[type=submit]",function(t){var e=N.call(this,t);e.text="input"==e.tag?this.value:(this.textContent||this.innerText||this.innerHTML).replace(/[\s\r\n]+/g," ").trim(),
  //   e.href=this.href,s.track("$click",e)})},s.trackSubmits=function(){S("submit","form",function(t){var e=N.call(this,t);s.track("$submit",e)})},s.trackChanges=function(){S("change","input, textarea, select",function(t){var e=N.call(this,t);s.track("$change",e)})},s.trackAll=function(){s.trackView(),s.trackClicks(),s.trackSubmits(),s.trackChanges()};try{y=JSON.parse(w("ahoy_events")||"[]")}catch(t){}for(var J=0;J<y.length;J++)P(y[J]);return s.start=function(){U(),s.start=function(){}},d=function(){a.startOnReady&&s.start()},
  //   "interactive"===document.readyState||"complete"===document.readyState?setTimeout(d,0):document.addEventListener("DOMContentLoaded",d),s});
  //   /* eslint-enable */

  //   // start Ahoy.js
  //   window.ahoy.start();

  //   // Configure Ahoy.js
  //   window.ahoy.configure(config);

  //   // Enable Debugging
  //   if (enableDebugger) {
  //     window.ahoy.debug();
  //     debug(`[ember-metrics] Ahoy.js debugger enabled`);
  //   }

  //   // Establish initial visit to find or create visit_token and visitor_token
  //   this.trackEvent({ event: "ahoy_initialized" });
  // }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (isPresent(props)) {
      window.ahoy.track(event, props);
    } else {
      window.ahoy.track(event);
    }
  }

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const { page } = compactedOptions;

    if (page) {
      compactedOptions["url"] = page;
      delete compactedOptions.page;
    }

    window.ahoy.trackView(compactedOptions);
  }

  willDestroy() {
    removeFromDOM('script[src*="ahoy"]');

    delete window.ahoy;
  }
}

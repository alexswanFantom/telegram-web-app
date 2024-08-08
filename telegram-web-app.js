(function(){var eventHandlers={};var locationHash='';try{locationHash=location.hash.toString();}catch(e){}
var initParams=urlParseHashParams(locationHash);var storedParams=sessionStorageGet('initParams');if(storedParams){for(var key in storedParams){if(typeof initParams[key]==='undefined'){initParams[key]=storedParams[key];}}}
sessionStorageSet('initParams',initParams);var isIframe=false,iFrameStyle;try{isIframe=(window.parent!=null&&window!=window.parent);if(isIframe){window.addEventListener('message',function(event){if(event.source!==window.parent)return;try{var dataParsed=JSON.parse(event.data);}catch(e){return;}
if(!dataParsed||!dataParsed.eventType){return;}
if(dataParsed.eventType=='set_custom_style'){if(event.origin==='https://web.telegram.org'){iFrameStyle.innerHTML=dataParsed.eventData;}}else if(dataParsed.eventType=='reload_iframe'){try{window.parent.postMessage(JSON.stringify({eventType:'iframe_will_reload'}),'*');}catch(e){}
location.reload();}else{receiveEvent(dataParsed.eventType,dataParsed.eventData);}});iFrameStyle=document.createElement('style');document.head.appendChild(iFrameStyle);try{window.parent.postMessage(JSON.stringify({eventType:'iframe_ready',eventData:{reload_supported:true}}),'*');}catch(e){}}}catch(e){}
function urlSafeDecode(urlencoded){try{urlencoded=urlencoded.replace(/\+/g,'%20');return decodeURIComponent(urlencoded);}catch(e){return urlencoded;}}
function urlParseHashParams(locationHash){locationHash=locationHash.replace(/^#/,'');var params={};if(!locationHash.length){return params;}
if(locationHash.indexOf('=')<0&&locationHash.indexOf('?')<0){params._path=urlSafeDecode(locationHash);return params;}
var qIndex=locationHash.indexOf('?');if(qIndex>=0){var pathParam=locationHash.substr(0,qIndex);params._path=urlSafeDecode(pathParam);locationHash=locationHash.substr(qIndex+1);}
var query_params=urlParseQueryString(locationHash);for(var k in query_params){params[k]=query_params[k];}
return params;}
function urlParseQueryString(queryString){var params={};if(!queryString.length){return params;}
var queryStringParams=queryString.split('&');var i,param,paramName,paramValue;for(i=0;i<queryStringParams.length;i++){param=queryStringParams[i].split('=');paramName=urlSafeDecode(param[0]);paramValue=param[1]==null?null:urlSafeDecode(param[1]);params[paramName]=paramValue;}
return params;}
function urlAppendHashParams(url,addHash){var ind=url.indexOf('#');if(ind<0){return url+'#'+addHash;}
var curHash=url.substr(ind+1);if(curHash.indexOf('=')>=0||curHash.indexOf('?')>=0){return url+'&'+addHash;}
if(curHash.length>0){return url+'?'+addHash;}
return url+addHash;}
function postEvent(eventType,callback,eventData){if(!callback){callback=function(){};}
if(eventData===undefined){eventData='';}
console.log('[Telegram.WebView] > postEvent',eventType,eventData);if(window.TelegramWebviewProxy!==undefined){TelegramWebviewProxy.postEvent(eventType,JSON.stringify(eventData));callback();}
else if(window.external&&'notify'in window.external){window.external.notify(JSON.stringify({eventType:eventType,eventData:eventData}));callback();}
else if(isIframe){try{var trustedTarget='https://web.telegram.org';trustedTarget='*';window.parent.postMessage(JSON.stringify({eventType:eventType,eventData:eventData}),trustedTarget);callback();}catch(e){callback(e);}}
else{callback({notAvailable:true});}};function receiveEvent(eventType,eventData){console.log('[Telegram.WebView] < receiveEvent',eventType,eventData);callEventCallbacks(eventType,function(callback){callback(eventType,eventData);});}
function callEventCallbacks(eventType,func){var curEventHandlers=eventHandlers[eventType];if(curEventHandlers===undefined||!curEventHandlers.length){return;}
for(var i=0;i<curEventHandlers.length;i++){try{func(curEventHandlers[i]);}catch(e){}}}
function onEvent(eventType,callback){if(eventHandlers[eventType]===undefined){eventHandlers[eventType]=[];}
var index=eventHandlers[eventType].indexOf(callback);if(index===-1){eventHandlers[eventType].push(callback);}};function offEvent(eventType,callback){if(eventHandlers[eventType]===undefined){return;}
var index=eventHandlers[eventType].indexOf(callback);if(index===-1){return;}
eventHandlers[eventType].splice(index,1);};function openProtoUrl(url){if(!url.match(/^(web\+)?tgb?:\/\/./)){return false;}
var useIframe=navigator.userAgent.match(/iOS|iPhone OS|iPhone|iPod|iPad/i)?true:false;if(useIframe){var iframeContEl=document.getElementById('tgme_frame_cont')||document.body;var iframeEl=document.createElement('iframe');iframeContEl.appendChild(iframeEl);var pageHidden=false;var enableHidden=function(){pageHidden=true;};window.addEventListener('pagehide',enableHidden,false);window.addEventListener('blur',enableHidden,false);if(iframeEl!==null){iframeEl.src=url;}
setTimeout(function(){if(!pageHidden){window.location=url;}
window.removeEventListener('pagehide',enableHidden,false);window.removeEventListener('blur',enableHidden,false);},2000);}
else{window.location=url;}
return true;}
function sessionStorageSet(key,value){try{window.sessionStorage.setItem('__telegram__'+key,JSON.stringify(value));return true;}catch(e){}
return false;}
function sessionStorageGet(key){try{return JSON.parse(window.sessionStorage.getItem('__telegram__'+key));}catch(e){}
return null;}
if(!window.Telegram){window.Telegram={};}
window.Telegram.WebView={initParams:initParams,isIframe:isIframe,onEvent:onEvent,offEvent:offEvent,postEvent:postEvent,receiveEvent:receiveEvent,callEventCallbacks:callEventCallbacks};window.Telegram.Utils={urlSafeDecode:urlSafeDecode,urlParseQueryString:urlParseQueryString,urlParseHashParams:urlParseHashParams,urlAppendHashParams:urlAppendHashParams,sessionStorageSet:sessionStorageSet,sessionStorageGet:sessionStorageGet};window.TelegramGameProxy_receiveEvent=receiveEvent;window.TelegramGameProxy={receiveEvent:receiveEvent};})();(function(){var Utils=window.Telegram.Utils;var WebView=window.Telegram.WebView;var initParams=WebView.initParams;var isIframe=WebView.isIframe;var WebApp={};var webAppInitData='',webAppInitDataUnsafe={};var themeParams={},colorScheme='light';var webAppVersion='6.0';var webAppPlatform='unknown';if(initParams.tgWebAppData&&initParams.tgWebAppData.length){webAppInitData=initParams.tgWebAppData;webAppInitDataUnsafe=Utils.urlParseQueryString(webAppInitData);for(var key in webAppInitDataUnsafe){var val=webAppInitDataUnsafe[key];try{if(val.substr(0,1)=='{'&&val.substr(-1)=='}'||val.substr(0,1)=='['&&val.substr(-1)==']'){webAppInitDataUnsafe[key]=JSON.parse(val);}}catch(e){}}}
if(initParams.tgWebAppThemeParams&&initParams.tgWebAppThemeParams.length){var themeParamsRaw=initParams.tgWebAppThemeParams;try{var theme_params=JSON.parse(themeParamsRaw);if(theme_params){setThemeParams(theme_params);}}catch(e){}}
var theme_params=Utils.sessionStorageGet('themeParams');if(theme_params){setThemeParams(theme_params);}
if(initParams.tgWebAppVersion){webAppVersion=initParams.tgWebAppVersion;}
if(initParams.tgWebAppPlatform){webAppPlatform=initParams.tgWebAppPlatform;}
function onThemeChanged(eventType,eventData){if(eventData.theme_params){setThemeParams(eventData.theme_params);window.Telegram.WebApp.MainButton.setParams({});updateBackgroundColor();receiveWebViewEvent('themeChanged');}}
var lastWindowHeight=window.innerHeight;function onViewportChanged(eventType,eventData){if(eventData.height){window.removeEventListener('resize',onWindowResize);setViewportHeight(eventData);}}
function onWindowResize(e){if(lastWindowHeight!=window.innerHeight){lastWindowHeight=window.innerHeight;receiveWebViewEvent('viewportChanged',{isStateStable:true});}}
function linkHandler(e){if(e.metaKey||e.ctrlKey)return;var el=e.target;while(el.tagName!='A'&&el.parentNode){el=el.parentNode;}
if(el.tagName=='A'&&el.target!='_blank'&&(el.protocol=='http:'||el.protocol=='https:')&&el.hostname=='t.me'){WebApp.openTgLink(el.href);e.preventDefault();}}
function strTrim(str){return str.toString().replace(/^\s+|\s+$/g,'');}
function receiveWebViewEvent(eventType){var args=Array.prototype.slice.call(arguments);eventType=args.shift();WebView.callEventCallbacks('webview:'+eventType,function(callback){callback.apply(WebApp,args);});}
function onWebViewEvent(eventType,callback){WebView.onEvent('webview:'+eventType,callback);};function offWebViewEvent(eventType,callback){WebView.offEvent('webview:'+eventType,callback);};function setCssProperty(name,value){var root=document.documentElement;if(root&&root.style&&root.style.setProperty){root.style.setProperty('--tg-'+name,value);}}
function setThemeParams(theme_params){if(theme_params.bg_color=='#1c1c1d'&&theme_params.bg_color==theme_params.secondary_bg_color){theme_params.secondary_bg_color='#2c2c2e';}
var color;for(var key in theme_params){if(color=parseColorToHex(theme_params[key])){themeParams[key]=color;if(key=='bg_color'){colorScheme=isColorDark(color)?'dark':'light'
setCssProperty('color-scheme',colorScheme);}
key='theme-'+key.split('_').join('-');setCssProperty(key,color);}}
Utils.sessionStorageSet('themeParams',themeParams);}
var webAppCallbacks={};function generateCallbackId(len){var tries=100;while(--tries){var id='',chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',chars_len=chars.length;for(var i=0;i<len;i++){id+=chars[Math.floor(Math.random()*chars_len)];}
if(!webAppCallbacks[id]){webAppCallbacks[id]={};return id;}}
throw Error('WebAppCallbackIdGenerateFailed');}
var viewportHeight=false,viewportStableHeight=false,isExpanded=true;function setViewportHeight(data){if(typeof data!=='undefined'){isExpanded=!!data.is_expanded;viewportHeight=data.height;if(data.is_state_stable){viewportStableHeight=data.height;}
receiveWebViewEvent('viewportChanged',{isStateStable:!!data.is_state_stable});}
var height,stable_height;if(viewportHeight!==false){height=(viewportHeight-mainButtonHeight)+'px';}else{height=mainButtonHeight?'calc(100vh - '+mainButtonHeight+'px)':'100vh';}
if(viewportStableHeight!==false){stable_height=(viewportStableHeight-mainButtonHeight)+'px';}else{stable_height=mainButtonHeight?'calc(100vh - '+mainButtonHeight+'px)':'100vh';}
setCssProperty('viewport-height',height);setCssProperty('viewport-stable-height',stable_height);}
var isClosingConfirmationEnabled=false;function setClosingConfirmation(need_confirmation){if(!versionAtLeast('6.2')){console.warn('[Telegram.WebApp] Closing confirmation is not supported in version '+webAppVersion);return;}
isClosingConfirmationEnabled=!!need_confirmation;WebView.postEvent('web_app_setup_closing_behavior',false,{need_confirmation:isClosingConfirmationEnabled});}
var headerColorKey='bg_color',headerColor=null;function getHeaderColor(){if(headerColorKey=='secondary_bg_color'){return themeParams.secondary_bg_color;}else if(headerColorKey=='bg_color'){return themeParams.bg_color;}
return headerColor;}
function setHeaderColor(color){if(!versionAtLeast('6.1')){console.warn('[Telegram.WebApp] Header color is not supported in version '+webAppVersion);return;}
if(!versionAtLeast('6.9')){if(themeParams.bg_color&&themeParams.bg_color==color){color='bg_color';}else if(themeParams.secondary_bg_color&&themeParams.secondary_bg_color==color){color='secondary_bg_color';}}
var head_color=null,color_key=null;if(color=='bg_color'||color=='secondary_bg_color'){color_key=color;}else if(versionAtLeast('6.9')){head_color=parseColorToHex(color);if(!head_color){console.error('[Telegram.WebApp] Header color format is invalid',color);throw Error('WebAppHeaderColorInvalid');}}
if(!versionAtLeast('6.9')&&color_key!='bg_color'&&color_key!='secondary_bg_color'){console.error('[Telegram.WebApp] Header color key should be one of Telegram.WebApp.themeParams.bg_color, Telegram.WebApp.themeParams.secondary_bg_color, \'bg_color\', \'secondary_bg_color\'',color);throw Error('WebAppHeaderColorKeyInvalid');}
headerColorKey=color_key;headerColor=head_color;updateHeaderColor();}
var appHeaderColorKey=null,appHeaderColor=null;function updateHeaderColor(){if(appHeaderColorKey!=headerColorKey||appHeaderColor!=headerColor){appHeaderColorKey=headerColorKey;appHeaderColor=headerColor;if(appHeaderColor){WebView.postEvent('web_app_set_header_color',false,{color:headerColor});}else{WebView.postEvent('web_app_set_header_color',false,{color_key:headerColorKey});}}}
var backgroundColor='bg_color';function getBackgroundColor(){if(backgroundColor=='secondary_bg_color'){return themeParams.secondary_bg_color;}else if(backgroundColor=='bg_color'){return themeParams.bg_color;}
return backgroundColor;}
function setBackgroundColor(color){if(!versionAtLeast('6.1')){console.warn('[Telegram.WebApp] Background color is not supported in version '+webAppVersion);return;}
var bg_color;if(color=='bg_color'||color=='secondary_bg_color'){bg_color=color;}else{bg_color=parseColorToHex(color);if(!bg_color){console.error('[Telegram.WebApp] Background color format is invalid',color);throw Error('WebAppBackgroundColorInvalid');}}
backgroundColor=bg_color;updateBackgroundColor();}
var appBackgroundColor=null;function updateBackgroundColor(){var color=getBackgroundColor();if(appBackgroundColor!=color){appBackgroundColor=color;WebView.postEvent('web_app_set_background_color',false,{color:color});}}
function parseColorToHex(color){color+='';var match;if(match=/^\s*#([0-9a-f]{6})\s*$/i.exec(color)){return '#'+match[1].toLowerCase();}
else if(match=/^\s*#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i.exec(color)){return('#'+match[1]+match[1]+match[2]+match[2]+match[3]+match[3]).toLowerCase();}
else if(match=/^\s*rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)\s*$/.exec(color)){var r=parseInt(match[1]),g=parseInt(match[2]),b=parseInt(match[3]);r=(r<16?'0':'')+r.toString(16);g=(g<16?'0':'')+g.toString(16);b=(b<16?'0':'')+b.toString(16);return '#'+r+g+b;}
return false;}
function isColorDark(rgb){rgb=rgb.replace(/[\s#]/g,'');if(rgb.length==3){rgb=rgb[0]+rgb[0]+rgb[1]+rgb[1]+rgb[2]+rgb[2];}
var r=parseInt(rgb.substr(0,2),16);var g=parseInt(rgb.substr(2,2),16);var b=parseInt(rgb.substr(4,2),16);var hsp=Math.sqrt(0.299*(r*r)+0.587*(g*g)+0.114*(b*b));return hsp<120;}
function versionCompare(v1,v2){if(typeof v1!=='string')v1='';if(typeof v2!=='string')v2='';v1=v1.replace(/^\s+|\s+$/g,'').split('.');v2=v2.replace(/^\s+|\s+$/g,'').split('.');var a=Math.max(v1.length,v2.length),i,p1,p2;for(i=0;i<a;i++){p1=parseInt(v1[i])||0;p2=parseInt(v2[i])||0;if(p1==p2)continue;if(p1>p2)return 1;return-1;}
return 0;}
function versionAtLeast(ver){return versionCompare(webAppVersion,ver)>=0;}
function byteLength(str){if(window.Blob){try{return new Blob([str]).size;}catch(e){}}
var s=str.length;for(var i=str.length-1;i>=0;i--){var code=str.charCodeAt(i);if(code>0x7f&&code<=0x7ff)s++;else if(code>0x7ff&&code<=0xffff)s+=2;if(code>=0xdc00&&code<=0xdfff)i--;}
return s;}
var BackButton=(function(){var isVisible=false;var backButton={};Object.defineProperty(backButton,'isVisible',{set:function(val){setParams({is_visible:val});},get:function(){return isVisible;},enumerable:true});var curButtonState=null;WebView.onEvent('back_button_pressed',onBackButtonPressed);function onBackButtonPressed(){receiveWebViewEvent('backButtonClicked');}
function buttonParams(){return{is_visible:isVisible};}
function buttonState(btn_params){if(typeof btn_params==='undefined'){btn_params=buttonParams();}
return JSON.stringify(btn_params);}
function buttonCheckVersion(){if(!versionAtLeast('6.1')){console.warn('[Telegram.WebApp] BackButton is not supported in version '+webAppVersion);return false;}
return true;}
function updateButton(){var btn_params=buttonParams();var btn_state=buttonState(btn_params);if(curButtonState===btn_state){return;}
curButtonState=btn_state;WebView.postEvent('web_app_setup_back_button',false,btn_params);}
function setParams(params){if(!buttonCheckVersion()){return backButton;}
if(typeof params.is_visible!=='undefined'){isVisible=!!params.is_visible;}
updateButton();return backButton;}
backButton.onClick=function(callback){if(buttonCheckVersion()){onWebViewEvent('backButtonClicked',callback);}
return backButton;};backButton.offClick=function(callback){if(buttonCheckVersion()){offWebViewEvent('backButtonClicked',callback);}
return backButton;};backButton.show=function(){return setParams({is_visible:true});};backButton.hide=function(){return setParams({is_visible:false});};return backButton;})();var mainButtonHeight=0;var MainButton=(function(){var isVisible=false;var isActive=true;var isProgressVisible=false;var buttonText='CONTINUE';var buttonColor=false;var buttonTextColor=false;var mainButton={};Object.defineProperty(mainButton,'text',{set:function(val){mainButton.setParams({text:val});},get:function(){return buttonText;},enumerable:true});Object.defineProperty(mainButton,'color',{set:function(val){mainButton.setParams({color:val});},get:function(){return buttonColor||themeParams.button_color||'#2481cc';},enumerable:true});Object.defineProperty(mainButton,'textColor',{set:function(val){mainButton.setParams({text_color:val});},get:function(){return buttonTextColor||themeParams.button_text_color||'#ffffff';},enumerable:true});Object.defineProperty(mainButton,'isVisible',{set:function(val){mainButton.setParams({is_visible:val});},get:function(){return isVisible;},enumerable:true});Object.defineProperty(mainButton,'isProgressVisible',{get:function(){return isProgressVisible;},enumerable:true});Object.defineProperty(mainButton,'isActive',{set:function(val){mainButton.setParams({is_active:val});},get:function(){return isActive;},enumerable:true});var curButtonState=null;WebView.onEvent('main_button_pressed',onMainButtonPressed);var debugBtn=null,debugBtnStyle={};if(initParams.tgWebAppDebug){debugBtn=document.createElement('tg-main-button');debugBtnStyle={font:'600 14px/18px sans-serif',display:'none',width:'100%',height:'48px',borderRadius:'0',background:'no-repeat right center',position:'fixed',left:'0',right:'0',bottom:'0',margin:'0',padding:'15px 20px',textAlign:'center',boxSizing:'border-box',zIndex:'10000'};for(var k in debugBtnStyle){debugBtn.style[k]=debugBtnStyle[k];}
document.addEventListener('DOMContentLoaded',function onDomLoaded(event){document.removeEventListener('DOMContentLoaded',onDomLoaded);document.body.appendChild(debugBtn);debugBtn.addEventListener('click',onMainButtonPressed,false);});}
function onMainButtonPressed(){if(isActive){receiveWebViewEvent('mainButtonClicked');}}
function buttonParams(){var color=mainButton.color;var text_color=mainButton.textColor;return isVisible?{is_visible:true,is_active:isActive,is_progress_visible:isProgressVisible,text:buttonText,color:color,text_color:text_color}:{is_visible:false};}
function buttonState(btn_params){if(typeof btn_params==='undefined'){btn_params=buttonParams();}
return JSON.stringify(btn_params);}
function updateButton(){var btn_params=buttonParams();var btn_state=buttonState(btn_params);if(curButtonState===btn_state){return;}
curButtonState=btn_state;WebView.postEvent('web_app_setup_main_button',false,btn_params);if(initParams.tgWebAppDebug){updateDebugButton(btn_params);}}
function updateDebugButton(btn_params){if(btn_params.is_visible){debugBtn.style.display='block';mainButtonHeight=48;debugBtn.style.opacity=btn_params.is_active?'1':'0.8';debugBtn.style.cursor=btn_params.is_active?'pointer':'auto';debugBtn.disabled=!btn_params.is_active;debugBtn.innerText=btn_params.text;debugBtn.style.backgroundImage=btn_params.is_progress_visible?"url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewport%3D%220%200%2048%2048%22%20width%3D%2248px%22%20height%3D%2248px%22%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222.25%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20stroke-dashoffset%3D%22106%22%20r%3D%229%22%20stroke-dasharray%3D%2256.52%22%20rotate%3D%22-90%22%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20attributeType%3D%22XML%22%20dur%3D%22360s%22%20from%3D%220%22%20to%3D%2212500%22%20repeatCount%3D%22indefini

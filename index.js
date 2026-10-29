/* Independent SillyTavern frontend extension. The official phone remains separate. */
const VERSION='0.3.3',KEY='__ksElectricCompanion',FRAME='ks-electric-companion-frame';
window[KEY]?.dispose?.();
let disposed=false,frame=null,timer=null,last='正在等待酒馆助手…';
// SillyTavern's extension switch is the only enable switch. Old local flags are
// deliberately ignored so an installed, enabled extension cannot remain asleep.
const setStatus=text=>{const next=String(text);if(next===last)return;last=next;window.dispatchEvent(new CustomEvent('ks-electric-companion-status',{detail:{version:VERSION,status:last}}));};
function stop(){clearTimeout(timer);timer=null;window.__ksElectricCompanionRuntime?.destroy?.();frame?.remove();frame=null;}
function legacyNames(){
  const helper=window.TavernHelper,names=[];
  const visit=(nodes,parent=true)=>{for(const item of nodes||[]){const active=parent&&Boolean(item.enabled);if(item.type==='folder')visit(item.scripts,active);else if(active&&typeof item.content==='string'&&item.content.includes('__ksElectricSilver'))names.push(item.name||'旧银灰脚本');}};
  for(const type of ['global','preset','character'])try{visit(helper.getScriptTrees({type}));}catch{}
  return [...new Set(names)];
}
function start(){
  if(disposed||frame)return;
  const h=window.TavernHelper;
  if(!h?.getVariables||!h?.updateVariablesWith||!window.SillyTavern?.getContext){setStatus('正在等待酒馆助手 4.x…');timer=setTimeout(start,300);return;}
  const names=legacyNames();
  if(names.length){setStatus('请先停用旧脚本：'+names.join('、')+'；停用后将自动连接。');timer=setTimeout(start,500);return;}
  const nativeVersion=document.getElementById('wave-phone-extension-settings')?.textContent?.match(/扩展版本\s*v([\d.]+)/)?.[1];
  if(!nativeVersion){setStatus('正在等待原电波扩展，请确认它已安装并启用。');timer=setTimeout(start,500);return;}
  if(nativeVersion!=='1.3.53'){setStatus('检测到原电波 '+nativeVersion+'；本增强包尚未验证此版本，已保持待机，原电波可继续使用。');return;}
  frame=document.createElement('iframe');frame.id=FRAME;frame.hidden=true;frame.setAttribute('aria-hidden','true');const frameUrl=new URL('frame.html',import.meta.url);frameUrl.searchParams.set('v',VERSION);frame.src=frameUrl.href;
  frame.addEventListener('error',()=>setStatus('增强界面加载失败，请检查安装包是否完整。'));
  document.body.append(frame);setStatus('正在连接原电波手机…');
}
const api={version:VERSION,get status(){return last;},setStatus,reconnect(){stop();start();},dispose(){if(disposed)return;disposed=true;stop();if(window[KEY]===api)delete window[KEY];}};
window[KEY]=api;window.addEventListener('pagehide',api.dispose,{once:true});start();

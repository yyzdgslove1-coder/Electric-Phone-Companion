'use strict';
for(const name of ['getVariables','updateVariablesWith','replaceVariables','getCharData','getCharWorldbookNames','getWorldbook','getChatMessages','getScriptTrees','generateRaw','stopGenerationById','injectPrompts','uninjectPrompts','updateTavernRegexesWith']){
  window[name]=(...args)=>{const helper=parent.TavernHelper;if(typeof helper?.[name]!=='function')throw Error('酒馆助手接口未就绪：'+name);return helper[name](...args);};
}
window.toastr=parent.toastr;
window.addEventListener('error',event=>parent.__ksElectricCompanion?.setStatus?.('增强界面错误：'+String(event.error?.message||event.message)),true);

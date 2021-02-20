/**
 * 获取浏览器默认语言
 */
export function getBrowserLang () {
    const type = navigator.appName;
    let lang = '';
    if (type === "Netscape") {
        lang = navigator.language;//获取浏览器配置语言，支持非IE浏览器
    } else {
        lang = navigator.userLanguage;//获取浏览器配置语言，支持IE5+ == navigator.systemLanguage
    };
    return lang;
    // return lang.substr(0, 2);//获取浏览器配置语言前两位
}

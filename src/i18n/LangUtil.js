// 国际标准话名称转换
export const langList = {
    'en-US': { v: 'en_US', vb: 'en', t: 'English' },
    'zh-CN': { v: 'zh_CN', vb: 'zh_CN', t: '中文' },
    'ko-KR': { v: 'ko_KR', vb: 'kr', t: '한국어' },
    'vi-VN': { v: 'vi_VN', vb: 'vi', t: 'Tiếng Việt' },
};

// 获取当前语种，设置默认语言
export const getLang = () => {
    const lang = window.localStorage.getItem('language') || 'en_US';
    return lang;
};

// 切换语言
export const switchLang = (lang) => {
    window.localStorage.setItem('language', lang);
    window.location.reload();
};

// 获取当前本地语言缩写
export const getBackLang = () => {
    const lang = getLang();
    return langList[lang].vb;
};

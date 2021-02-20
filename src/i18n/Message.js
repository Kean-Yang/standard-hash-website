// import zhCN from 'antd-mobile/lib/locale-provider/zh_CN';
// import enUS from 'antd-mobile/lib/locale-provider/en_US';
// import koKR from 'antd-mobile/lib/locale-provider/ko_KR';
// import viVN from 'antd-mobile/lib/locale-provider/vi_VN';

import { getLang } from './LangUtil';

export const messageList = {
    antd: {},
};

export const I18nMessage = messageList.antd[getLang()];

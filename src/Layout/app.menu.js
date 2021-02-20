/**
 * 左侧菜单
 * @author
 * @create
 */

import Twiiter from '../assets/socials/twiiter.svg';
import Discord from '../assets/socials/discord.svg';
import Medium from '../assets/socials/medium.svg';
import Telegram from '../assets/socials/telegram.svg';
import RedditPofile from '../assets/socials/Vector.svg';

import {
    DD_TWITTER_URL,
    DD_DISCORD_URL,
    DD_MEDIUM_URL,
    DD_T_ME_URL,
    REDDIT_POFILE,
    REWARD_SYMBOL,
    OFFICIAL_SYMBOL,
} from '../constants';

// 导航
const AppMenu = [
    {
        name: 'Buy',
        url: '/buy',
        icon: '',
        key: 'Buy',
        target: false,
        childrenName: OFFICIAL_SYMBOL,
    },
    {
        name: 'Mine',
        url: '/mine',
        icon: '',
        key: 'Mine',
        target: false,
        childrenName: REWARD_SYMBOL,
    },
    {
        name: 'Sell',
        url: 'https://app.uniswap.org/#/swap',
        icon: '',
        key: 'Sell',
        target: true,
        childrenName: OFFICIAL_SYMBOL,
    },
    {
        name: 'Burn',
        url: '/burn',
        icon: '',
        key: 'Brun',
        target: false,
        childrenName: OFFICIAL_SYMBOL,
    },
];

const AppMenuMobile = [
    {
        name: 'Buy',
        url: '/buy',
        icon: '',
        key: 'Buy',
        childrenName: OFFICIAL_SYMBOL,
    },
    {
        name: 'Mine',
        url: '/mine',
        icon: '',
        key: 'Mine',
        childrenName: REWARD_SYMBOL,
    },
    {
        name: 'Burn',
        url: '/burn',
        icon: '',
        key: 'Brun',
        childrenName: OFFICIAL_SYMBOL,
    },
];

const AppMenuSocial = [
    {
        name: 'Twiiter',
        url: DD_TWITTER_URL,
        icon: Twiiter,
        key: 'Twiiter',
    },
    {
        name: 'Discord',
        url: DD_DISCORD_URL,
        icon: Discord,
        key: 'Discord',
    },
    {
        name: 'Medium',
        url: DD_MEDIUM_URL,
        icon: Medium,
        key: 'Medium',
    },
    {
        name: 'Reddit pofile',
        url: REDDIT_POFILE,
        icon: RedditPofile,
        key: 'Reddit pofile',
    },

    {
        name: 'Telegram',
        url: DD_T_ME_URL,
        icon: Telegram,
        key: 'Telegram',
    },
];

export { AppMenu, AppMenuMobile, AppMenuSocial };

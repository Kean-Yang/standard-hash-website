import { HttpRequestAxios } from '../utils/HttpRequestAxios';

/**
 * 购买 DHM
 * @param amount 购买数量
 * @param address 用户地址
 */

export const ApiAppBuy = (address, amount) => {
    return HttpRequestAxios.post('/app/buy', {
        address,
        amount: amount.toString(),
    }).then((res) => res.data);
};

/**
 * 质押 DHM
 * @param amount 质押数量
 * @param address 用户地址
 */

export const ApiAppStake = (address, amount) => {
    return HttpRequestAxios.post('/app/stake', {
        address,
        amount: amount.toString(),
    }).then((res) => res.data);
};

/**
 * 赎回 DHM claim
 * @param address 用户地址
 */

export const ApiAppWithdraw = (address) => {
    return HttpRequestAxios.post('/app/withdraw', {
        address,
    }).then((res) => res.data);
};




/**
 * 回收 DHM
 * @param amount 回收数量
 * @param address 用户地址
 */

export const ApiAppRecycle = (address, amount) => {
    return HttpRequestAxios.post('/app/recycle', {
        address,
        amount: amount.toString(),
        price: '0',
    }).then((res) => res.data);
};

/**
 * 领取奖励
 */

export const ApiAppClaim = (address) => {
    return HttpRequestAxios.post(`/app/claim?address=${address}`).then(
        (res) => res.data
    );
};

/**
 * 领取奖励
 */

export const ApiPartialclaim = () => {
    return HttpRequestAxios.post('/app/partialclaim').then((res) => res.data);
};

/**
 * 当前 DHM 售卖价格
 */

export const ApiAppSellprice = () => {
    return HttpRequestAxios.get('/app/sellprice').then((res) => res.data);
};

/**
 * 当前 DHM 回收价格
 */

export const ApiAppRecycleprice = () => {
    return HttpRequestAxios.get('/app/recycleprice').then((res) => res.data);
};

/**
 * DHM 总燃烧量
 */

export const ApiAppTotalBurnt = () => {
    return HttpRequestAxios.get('/app/totalburnt').then((res) => res.data);
};

/**
 * 用户当前的平台主要余额
 * @param address 用户地址
 */

export const ApiAppUserBalances = (address) => {
    return HttpRequestAxios.get(`/app/userbalances?address=${address}`).then(
        (res) => res.data
    );
};

/**
 * DHM 硬顶
 */

export const ApiAppCap = () => {
    return HttpRequestAxios.get('/app/cap').then((res) => res.data);
};

/**
 * DHM 流通量
 */

export const ApiAppSupply = () => {
    return HttpRequestAxios.get('/app/supply').then((res) => res.data);
};

/**
 * 用户授权
 * @param address 用户地址
 */

export const ApiAppAllowances = (address) => {
    return HttpRequestAxios.get(`/app/allowances?address=${address}`).then(
        (res) => res.data
    );
};

/**
 * 当前质押总额
 */

export const ApiAppTotalTakes = () => {
    return HttpRequestAxios.get('/app/totalstakes').then((res) => res.data);
};

/**
 * 用户可领取的奖励 wBTC
 * @param address 用户地址
 */

export const ApiToClaimBalances = (address) => {
    return HttpRequestAxios.get(`/app/rewardtoclaim?address=${address}`).then(
        (res) => res.data
    );
};

/**
 * 用户的质押量
 * @param address 用户地址
 */

export const ApiUserStaked = (address) => {
    return HttpRequestAxios.get(`/app/userstaked?address=${address}`).then(
        (res) => res.data
    );
};

/**
 * BTC当日价格 昨日分发BTC
 */

export const ApiLatestepochReward = () => {
    return HttpRequestAxios.get('/app/latestepochreward').then(
        (res) => res.data
    );
};

/**
 * 全网总奖励
 */

export const ApiTotalRewarded = () => {
    return HttpRequestAxios.get('/app/totalrewarded').then((res) => res.data);
};

/**
 * 代售的 DHM
 */

export const ApiDhmAvailable = () => {
    return HttpRequestAxios.get('/app/dhmavailable').then((res) => res.data);
};

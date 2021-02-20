// 当前打包环境
const buildEnv = process.env.BUILD_ENV || 'testnet_hecochain';

console.log(process.env.BUILD_ENV)
// 根据打包环境
let envConf = {};
switch (buildEnv) {
    case "etherscan":
        envConf = require('./env-pro-etherscan');
        break;
    case 'hecochain':
        envConf = require('./env-pro-hecochain');
        break;
    case "binance":
        envConf = require('./env-pro-binance');
        break;
    case "testnet_binance":
        envConf = require('./env-test-binance');
        break;
    case "testnet_hecochain":
        envConf = require('./env-test-huobi');
        break;
    default:
        envConf = require('./env-test-huobi');
        break;
}

export { buildEnv }; // 当前网络环境
export const CHAINID = envConf.CHAINID; // 钱包id
export const DEFAULT_CURRENT_PRICE = envConf.DEFAULT_CURRENT_PRICE; // 默认dhm当前价
export const TIMEOUT = envConf.TIMEOUT; // 超时
export const TimeLength = envConf.TimeLength; //距离下一个Epoch 时长
export const StartEpoch = envConf.StartEpoch; // 初始Epoch
export const INIT_SYMBOL = envConf.INIT_SYMBOL; // 默认UDDT
export const REWARD_SYMBOL = envConf.REWARD_SYMBOL; //奖励币种
export const OFFICIAL_SYMBOL = envConf.OFFICIAL_SYMBOL; //官方发行币 DHM
export const EXECUTION_TIME = envConf.EXECUTION_TIME; //请求时长
export const BSAE_API_URL = envConf.BSAE_API_URL; //api 地址
export const MetaMask_CONF_URL = envConf.MetaMask_CONF_URL; // MetaMask rpc网络地址
export const OFFICIAL2_SYMBOL = envConf.OFFICIAL2_SYMBOL; // //官方发行币DHT

import Web3 from 'web3';
// import {
//     MINI,
// } from './constants';
import erc20miniAbi from './abi/erc20.json';
import Wbe3Utils from './Wbe3Utils';
import * as Tools from '../utils/Tools';

class DhashContract {
    /**
     *
     * @param {*}
     * @param {*}
     */
    async getUSDTBalance(account) {
        // const number = await Web3.eth.blockNumber;
        console.log(Web3); // 2744
        const balance = await Web3.eth.getBalance(account);
        return balance.toNumber();
        try {
            const number = await Web3.eth.blockNumber;
            console.log(number); // 2744
            const balance = await Web3.eth.getBalance(account);
            return balance.toNumber();
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

export default new DhashContract();

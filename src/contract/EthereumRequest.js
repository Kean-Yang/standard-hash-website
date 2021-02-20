import { message } from 'antd';
// import Web3 from 'web3';
import { CHAINID } from '../constants';
import Wbe3Utils from './Wbe3Utils';

export async function sendTransaction (transactionParameters, resFun, errFun, transaction = false, cancelFun) {
    try {
        // return new Promise(async (resolve, reject) => {
        await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [{ ...transactionParameters, chainId: CHAINID }],
            })
            .then(async (txHash) => {
                // console.log(txHash)
                if (transaction) {
                    checkTransactionReceipt(txHash, resFun, errFun);
                }
            })
            .catch((err) => {
                switch (err.code) {
                    case 4001:
                        message.error(err.message);
                        cancelFun();
                        break;
                    default:
                        message.error(err.message);
                        cancelFun();
                        console.log(err);
                }
            });
        // });
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function checkTransactionReceipt (txHash, resFun, errFun) {
    try {
        const receipt = await getTransactionReceiptPromise(txHash);
        // console.log(receipt)
        if (!receipt) {
            setTimeout(async () => {
                checkTransactionReceipt(txHash, resFun, errFun);
            }, 5000);
        } else {
            if (receipt && receipt.status) {
                resFun();
            } else if (receipt) {
                // 交易失败
                errFun();
            }
        }
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function getTransactionReceiptPromise (txHash) {
    try {
        return new Promise(((resolve, reject) => {
            Wbe3Utils.eth.getTransactionReceipt(txHash, function (err, data) {
                // console.log(err, data, 'get receipt', txHash)
                if (err !== null) reject(err);
                else resolve(data);
            });
        }));
    } catch (e) {
        console.log(e);
        return 0;
    }
}
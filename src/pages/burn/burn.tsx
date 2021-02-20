import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import InputaMount from '../../components/InputaMount/index.tsx';
import UnlockWalletpage from '../../components/UnlockWallet/UnlockWalletpage.tsx';
import BuyButton from '../../components/BuyButton/index.tsx';
import { ApiAppRecycle } from '../../services/index.js';
import { contractTransaction } from '../../utils/ContractTransaction.js';
import * as Tools from '../../utils/Tools';
import {
    ApiAppTotalBurnt,
    ApiAppUserBalances,
    ApiAppCap,
    ApiAppRecycleprice,
} from '../../services/index.js';
import BuyModal from '../../components/ConfModal/index.tsx';
import { OFFICIAL_SYMBOL, EXECUTION_TIME } from '../../constants';
import { useWallet } from 'use-wallet';
import './burn.scss';

const Burn = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, status } = wallet;
    const [totalBurned, setTotalBurned] = useState(0);
    const [burnButLoading, setBurnButLoading] = useState(false); // 按钮加载状态
    const [amount, setAmount] = useState(0); // 输入框值
    const [user, setUser] = useState({}); // 用户余额
    const [recyclePrice, setRecyclePrice] = useState(0); // 回收价

    const [visible, setVisible] = useState(false);
    const [minerType, setMinerType] = useState(0); // 矿机型号
    // const [totalSupply, setTotalSupply] = useState(0); // 顶
    const [disabled, setDisabled] = useState(true); // 输入按钮状态
    const [modalState, setModalState] = useState(0); // 弹窗 0:授权 1授权中 2交易中 3交易成功 -1交易失败; 4 授权完成
    const getInputaMountNumber = useCallback((val) => {
        setAmount(val);
        setDisabled(val <= 0);
    });

    // 总校销毁量 total Burned
    const getApiAppTotalBurnt = async (price) => {
        ApiAppTotalBurnt()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    // 总销毁量
                    setTotalBurned(
                        Tools.toThousands(res.data.total_pretty || 0)
                    );
                    // 矿机类型 (1-（销毁量/1000000）) × 48W/T
                    setMinerType(
                        Tools.mul(
                            Tools.sub(
                                1,
                                isNaN(
                                    Tools.div(
                                        res.data.total_pretty,
                                        price
                                    )
                                )
                                    ? 0
                                    : Tools.div(
                                        res.data.total_pretty,
                                        price
                                    )
                            ),
                            48
                        ) || 0
                    );
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setTotalBurned(0);
                setMinerType(48)
                return 0;
            });
    };

    // 回收 DHM
    const ApiAppRecycleFun = async () => {
        setBurnButLoading(true);
        const max = user.dhm_pretty;
        const isMax = amount.toString() === max ? true : false;
        await ApiAppRecycle(account, isMax ? '-1' : amount)
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    if (res.data.txs.length > 1) {
                        setModalState(1);
                        setVisible(true);
                        contractTransaction(
                            account,
                            res.data.txs[0].contract,
                            res.data.txs[0].calldata,
                            () => {
                                contractTransaction(
                                    account,
                                    res.data.txs[1].contract,
                                    res.data.txs[1].calldata,
                                    () => {
                                        // setModalnfoState(1);
                                        setModalState(2);
                                        message.warning(t('v1_Pendding'));
                                        setVisible(true);
                                        setTimeout(() => {
                                            setModalState(3);
                                            setBurnButLoading(false);
                                            getApiAppUserBalances(); // 余额
                                            getApiAppSupply();
                                        }, EXECUTION_TIME);
                                    },
                                    () => {
                                        setModalState(-1);
                                        setBurnButLoading(false);
                                        message.warning(t('v1_Failed'));
                                    },
                                    true, () => {
                                        setBurnButLoading(false);
                                        setVisible(false);
                                    }
                                );
                            },
                            () => {
                                setBuyButLoading(false);
                                setVisible(false);
                                message.warning(t('v1_Failed'));
                            }, true, () => {
                                setBuyButLoading(false);
                                setVisible(false);
                            }
                        );
                    } else {
                        setModalState(2);
                        setVisible(true);
                        contractTransaction(
                            account,
                            res.data.txs[0].contract,
                            res.data.txs[0].calldata,
                            () => {
                                message.warning(t('v1_Pendding'));
                                setTimeout(() => {
                                    setModalState(3);
                                    setBurnButLoading(false);
                                    getApiAppUserBalances(); // 余额
                                    getApiAppSupply();
                                }, EXECUTION_TIME);
                            },
                            () => {
                                setModalState(-1);
                                setBurnButLoading(false);
                                message.warning(t('v1_Failed'));
                            },
                            true, () => {
                                setBurnButLoading(false);
                                setVisible(false);
                            }
                        );
                    }
                } else {
                    setBurnButLoading(false);
                    message.warning(t('v1_Failed'));
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setBuyButLoading(false);
                setVisible(false);
                return [];
            });
    };

    // 回收价

    const getApiAppRecycleprice = async () => {
        ApiAppRecycleprice()
            .then((res) => {
                if (res.code === 200) {
                    setRecyclePrice(res.data.price_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setRecyclePrice(0);
                return 0;
            });
    };

    // 余额
    const getApiAppUserBalances = async () => {
        ApiAppUserBalances(account)
            .then((res) => {
                // console.log('ApiAppUserBalances:', res.data.dhm_pretty);
                if (res.code === 200) {
                    setUser(res.data);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setUser({});
                return 0;
            });
    };

    // 顶
    const getApiAppSupply = async () => {
        ApiAppCap()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    getApiAppTotalBurnt(res.data.amount_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                return false;
            });
    };

    useEffect(() => {
        if (account && status === 'connected') {
            getApiAppUserBalances();
        }
    }, [account, status]);

    useEffect(() => {
        if (account && status === 'connected') {
            getApiAppSupply();
        }
    }, [status, account]);

    useEffect(() => {
        getApiAppRecycleprice();
    }, []);

    return (
        <div className="burn-page">
            {wallet && !account && status !== 'connected' ? (
                <UnlockWalletpage />
            ) : (
                    <>
                        <div className="total">
                            <div className="amount">
                                {t('v1_w_TH', {
                                    x: isNaN(minerType)
                                        ? 0
                                        : Tools.numFmt(minerType, 2) || '0',
                                })}
                            </div>
                            <div className="desc">{t('v1_MINER_TYPE')}</div>
                        </div>
                        <div className="burn-content">
                            <div className="data">
                                <div className="data-border">
                                    <div className="amount price">
                                        ${Tools.toThousands(Tools.fmtDec(recyclePrice || 0, 4))}
                                    </div>
                                    <div className="text">
                                        {t('v1_Current_Price')}
                                    </div>
                                    <div className="amount available">
                                        {Tools.toThousands(Tools.fmtDec(totalBurned || 0, 4))}
                                    </div>
                                    <div className="text">
                                        {t('v1_Total_Burned')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <InputaMount
                            balance={Tools.fmtDec(user.dhm_pretty || 0, 4)}
                            maxBalance={Tools.fmtDec(user.dhm_pretty || 0, 4)}
                            onConfirm={getInputaMountNumber}
                            sumbol={OFFICIAL_SYMBOL}
                            balanceSumbol={OFFICIAL_SYMBOL}

                        />

                        <BuyButton
                            loading={burnButLoading}
                            disabled={disabled || user.dhm_pretty <= 0}
                            butText={t('v1_BURN')}
                            butClassName={'operation-light-but'}
                            onChangeFun={() => {
                                ApiAppRecycleFun();
                            }}
                        />
                    </>
                )}

            {/* //amount, text, butText, buyFun */}
            <BuyModal
                amount={amount}
                visible={visible}
                buyButloading={modalState !== 3 && modalState !== -1}
                disabled={modalState !== 3 && modalState !== -1}
                text={
                    modalState === 0 ||
                        modalState === 1 ||
                        modalState === 2 ||
                        modalState === 4
                        ? t('v1_You_will_burned')
                        : modalState === 3
                            ? t('v1_Success_s')
                            : modalState === -1
                                ? t('v1_BACK')
                                : ''
                }
                butText={
                    modalState === 0
                        ? t('v1_Approve')
                        : modalState === 1
                            ? t('v1_authorization')
                            : modalState === 2
                                ? t('v1_Pendding')
                                : modalState === 3
                                    ? t('v1_BACK')
                                    : modalState === 4
                                        ? t('v1_BUY_but')
                                        : modalState === -1
                                            ? t('v1_Fail')
                                            : t('v1_BACK')
                }
                buyFun={() => {
                    setModalState(0);
                    setVisible(false);
                }}
            ></BuyModal>
        </div>
    );
};

export default Burn;

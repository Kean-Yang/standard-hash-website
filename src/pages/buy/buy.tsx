import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Alert } from 'antd';
import { useHistory } from 'react-router-dom';
import InputaMount from '../../components/InputaMount/index.tsx';
import BuyButton from '../../components/BuyButton/index.tsx';
import UnlockWalletpage from '../../components/UnlockWallet/UnlockWalletpage.tsx';
import BuyModal from '../../components/ConfModal/index.tsx';
// import Overheated from '../../components/ConfModal/Overheated.tsx';
import * as Tools from '../../utils/Tools';
import { useWallet } from 'use-wallet';
import {
    ApiAppBuy,
    ApiAppSellprice,
    ApiAppSupply,
    ApiAppUserBalances,
    ApiLatestepochReward,
    ApiDhmAvailable,
    ApiAppTotalBurnt
} from '../../services/index.js';
import { contractTransaction } from '../../utils/ContractTransaction.js';
import {
    OFFICIAL_SYMBOL,
    EXECUTION_TIME,
    ETHERSCAN_IO,
    DEFAULT_CURRENT_PRICE,
    INIT_SYMBOL
} from '../../constants';
import './buy.scss';

const Buy = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, status } = wallet;
    const history = useHistory();
    const [balance, setBalance] = useState(0); // HUSD转DHM 余额
    const [currentPrice, setCurrentPrice] = useState(DEFAULT_CURRENT_PRICE); // 当前价格
    const [totalBurned, setTotalBurned] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [buyState, setBuyState] = useState(false);
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState(0); // 输入框值
    const [buyButLoading, setBuyButLoading] = useState(false); // 按钮加载状态
    // 年化收益率 = 当日分发BTC × 当日BTC价格 / 6.5 / 抵押数量
    const [apy, setApy] = useState(0); // APY
    const [available, setAvailable] = useState(0); // 售卖中
    const [user, setUser] = useState({}); // 用户余额
    const [disabled, setDisabled] = useState(true); // 按钮状态
    const [modalState, setModalState] = useState(0); // 弹窗 0:授权 1授权中 2交易中 3交易成功 -1交易失败; 4 授权完成
    // const [btcInfo, setBtcInfo] = useState({}); // BTC当日价格 昨日分发BTC
    const [showBtcInfoErr, setShowBtcInfoErr] = useState({
        code: 200,
        msg: '',
    }); // BTC当日价格 昨日分发BTC

    const getInputaMountNumber = useCallback((val) => {

        setAmount(val);
        setDisabled(val <= 0);
    });


    // BTC当日价格 昨日分发BTC
    const getApiLatestepochReward = async (price) => {
        await ApiLatestepochReward()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    // 年化收益率 = 当日分发BTC × 当日BTC价格 / dhm价格 / 抵押数量 *365
                    // 年化收益率 = 总奖励 * 当日BTC价格 / 总抵押数量 / dhm 价格 /epochs * 365
                    console.log(res.data.reward.amount_pretty, price);
                    console.log(Number(res.data.total_stakes) > 0)
                    console.log(
                        Tools.mul(
                            Tools.div(
                                Tools.div(
                                    Tools.mul(
                                        Number(
                                            res.data.reward.amount_pretty || 0
                                        ),
                                        Number(
                                            res.data.btc_price || 0
                                        )
                                    ),
                                    Number(price || DEFAULT_CURRENT_PRICE)
                                ),
                                Number(res.data.total_stakes)
                            ),
                            365
                        )
                    )

                    setApy(
                        res.data.reward.amount !== '-1' || res.data.reward.amount !== '0'
                            ? Number(res.data.total_stakes) > 0
                                ? Tools.mul(
                                    Tools.div(
                                        Tools.div(
                                            Tools.mul(
                                                Number(
                                                    res.data.reward.amount_pretty || 0
                                                ),
                                                Number(
                                                    res.data.btc_price || 0
                                                )
                                            ),
                                            Number(price || DEFAULT_CURRENT_PRICE)
                                        ),
                                        Number(res.data.total_stakes)
                                    ),
                                    365
                                )
                                : 0
                            : Tools.mul(
                                Tools.div(
                                    Tools.div(
                                        Tools.div(
                                            Tools.mul(
                                                Number(
                                                    res.data.total_rewarded
                                                ),
                                                Number(res.data.btc_price)
                                            ),
                                            Number(res.data.total_stakes)
                                        ),
                                        Number(price || DEFAULT_CURRENT_PRICE)
                                    ),
                                    Number(res.data.epochs)
                                ),
                                365
                            )
                    );
                } else {
                    setShowBtcInfoErr({
                        code: res.code,
                        msg: res.msg + ' please be nice and patient',
                    });
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setApy(0);
                return 0;
            });
    };

    // 当前价格 current Price
    const getApiAppSellprice = async () => {
        ApiAppSellprice()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setCurrentPrice(res.data.price_pretty);
                    getApiAppUserBalances(res.data.price_pretty);
                    getApiLatestepochReward(res.data.price_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setCurrentPrice(0);
                return 0;
            });
    };

    // 流通量
    const getApiAvailable = async () => {
        ApiDhmAvailable()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setAvailable(res.data.amount_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setAvailable(0);
                return 0;
            });
    };

    // 顶
    const getApiAppSupply = async () => {
        ApiAppSupply()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setTotalSupply(res.data.amount_pretty);
                    getApiAppTotalBurnt(res.data.amount_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setTotalSupply(0);
                return 0;
            });
    };

    // 总校销毁量 total Burned
    const getApiAppTotalBurnt = async (supply) => {
        ApiAppTotalBurnt()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    // 总销毁量
                    setTotalBurned(
                        Tools.sub(supply || totalSupply, res.data.total_pretty || 0)
                    );
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setTotalBurned(0);
                return 0;
            });
    };

    // 余额
    const getApiAppUserBalances = async (price) => {
        ApiAppUserBalances(account)
            .then((res) => {
                // console.log('ApiAppUserBalances:', res);
                if (res.code === 200) {
                    setUser(res.data);
                    setBalance(
                        Tools.fmtDec(
                            Tools.div(
                                res.data.usdt_pretty,
                                price || currentPrice || DEFAULT_CURRENT_PRICE
                            ),
                            4
                        )
                    );
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setUser({});
                setBalance(0)
                return 0;
            });
    };

    // BUY
    const ApiAppBuyFun = async () => {
        setBuyButLoading(true);
        const max = Tools.GE(balance, available) ? available : balance || 0;
        const isMax = amount.toString() === max ? true : false;
        await ApiAppBuy(account, isMax ? '-1' : amount)
            .then((res) => {
                if (res.code === 200) {
                    if (res.data.txs.length > 1) {
                        setModalState(1);
                        setVisible(true);
                        contractTransaction(
                            account,
                            res.data.txs[0].contract,
                            res.data.txs[0].calldata,
                            () => {
                                setModalState(4);
                                contractTransaction(
                                    account,
                                    res.data.txs[1].contract,
                                    res.data.txs[1].calldata,
                                    () => {
                                        // setModalnfoState(1);
                                        setModalState(2);
                                        message.warning(t('v1_Pendding'));
                                        setTimeout(() => {
                                            setModalState(3);
                                            setBuyButLoading(false);
                                            setBuyState(true);
                                        }, EXECUTION_TIME);
                                    },
                                    () => {
                                        setModalState(-1);
                                        setBuyButLoading(false);
                                        // setVisible(false);
                                        message.warning(t('v1_Failed'));
                                    }, true,
                                    () => {
                                        setModalState(4);
                                        setBuyButLoading(false);
                                        setVisible(false);
                                    }
                                );
                            },
                            () => {
                                setBuyButLoading(false);
                                setVisible(false);
                                setModalState(0);
                                message.warning(t('v1_Failed'));
                            },
                            true,
                            () => {
                                setModalState(0);
                                setBuyButLoading(false);
                                setVisible(false);
                            }
                        );
                    } else {
                        setModalState(2);
                        setVisible(true)
                        contractTransaction(
                            account,
                            res.data.txs[0].contract,
                            res.data.txs[0].calldata,
                            () => {
                                // setModalnfoState(1);
                                message.warning(t('v1_Pendding'));
                                setTimeout(() => {
                                    setModalState(3);
                                    setBuyButLoading(false);
                                    setBuyState(true);
                                }, EXECUTION_TIME);
                            },
                            () => {
                                setModalState(-1);
                                setBuyButLoading(false);
                                // setVisible(false);
                                message.warning(t('v1_Failed'));
                            }, true,
                            () => {
                                setModalState(4);
                                setBuyButLoading(false);
                                setVisible(false);
                            }
                        );
                    }
                } else {
                    setBuyButLoading(false);
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

    const getAlldata = async () => {
        await getApiAppSellprice(); // 当前价格 current Price
        await getApiAvailable(); // 流通量
        await getApiAppSupply(); // DHM 硬顶
    };

    useEffect(() => {
        if (account && status === 'connected') {
            getAlldata();
        }
    }, [status, account]);

    return (
        <div className="buy">
            {/* {Tools.LT(new Date().getTime(), Number(t('deadline'))) ? <Overheated text={t('v1_overheated')} deadline={Number(t('deadline'))} ></Overheated> : ""} */}
            {/* <Overheated text={t('v1_overheated')} ></Overheated> */}
            {wallet && !account ? (
                <UnlockWalletpage />
            ) : account && !buyState && status === 'connected' ? (
                <>
                    {showBtcInfoErr.code !== 200 ? (
                        <div className="Alert-err">
                            <Alert
                                message={showBtcInfoErr.msg || ''}
                                type="info"
                                showIcon
                                closable
                            />
                        </div>
                    ) : (
                            ''
                        )}
                    <div className="apy">
                        <div className="amount">
                            {(isNaN(apy) ? 0 : Tools.numFmt(apy * 100, 2)) || 0}
                            %
                        </div>
                        <div className="desc">{t('v1_APY')}</div>
                    </div>
                    <div className="buy-content">
                        <div className="data">
                            <div className="data-border">
                                <div className="amount price">
                                    ${Tools.toThousands(Tools.fmtDec(currentPrice || 0, 4))}
                                </div>
                                <div className="text">
                                    {t('v1_Current_Price')}
                                </div>
                                <div className="amount available">
                                    {/* {t('v_1real') ? Tools.toThousands(available) || 0 : Tools.sub(Number(available), 100000)} */}
                                    {Tools.toThousands(Tools.fmtDec(available || 0, 4))}
                                </div>
                                <div className="text">{t('v1_Available')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="total">
                        <div className="amount">
                            {/* {t('v_1real') ? Tools.toThousands(totalBurned) || 0 : Tools.sub(Number(totalBurned), 200000)} */}
                            {Tools.toThousands(Tools.fmtDec(totalBurned || 0, 4))}
                        </div>
                        <div className="text">
                            <a
                                href={ETHERSCAN_IO}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('v1_Total_supply')}
                            </a>
                        </div>

                        {/* <div className="miners">
                            <a
                                href={MINERS_STATS}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('v1_Miners_stats')}
                            </a>
                        </div> */}
                    </div>

                    <InputaMount

                        balance={Tools.fmtDec(user.usdt_pretty || 0, 4)}
                        maxBalance={
                            Tools.GE(balance, available)
                                ? Tools.fmtDec(available || 0, 4)
                                : Tools.fmtDec(balance || 0, 4) || 0
                        }
                        onConfirm={getInputaMountNumber}
                        sumbol={OFFICIAL_SYMBOL}
                        balanceSumbol={INIT_SYMBOL}
                    />

                    <BuyButton
                        loading={buyButLoading}
                        // disabled={disabled || user.usdt_pretty <= 0}
                        // butText={t('v1_BUY_but')}
                        disabled={'false' || false}
                        butText={t('v1_overheated')}
                        butClassName={'operation-light-but'}
                        onChangeFun={() => {
                            // console.log('ApiAppBuyFun');
                            ApiAppBuyFun();
                        }}
                    />
                </>
            ) : (
                        <div className="success">
                            <div className="success-border">
                                <div className="amount price">{amount}</div>
                                <div className="text">{t('v1_Success')}</div>
                                <BuyButton
                                    loading={false}
                                    butText={t('v1_START_MINE')}
                                    butClassName={'operation-lightblue-but'}
                                    onChangeFun={() => {
                                        history.push('/mine');
                                    }}
                                />
                            </div>
                        </div>
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
                        ? t('v1_You_will_buy')
                        : modalState === 3
                            ? t('v1_Success_s')
                            : modalState === -1
                                ? t('v1_Fail')
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
                                    ? t('v1_START_MINE')
                                    : modalState === 4
                                        ? t('v1_BUY_but')
                                        : modalState === -1
                                            ? t('v1_BACK')
                                            : ''

                    // v1_Approve
                }
                buyFun={() => {
                    switch (modalState) {
                        case 0:
                            ApiAppBuyFun();
                            break;
                        case 3:
                            history.push('/mine');
                            break;
                        case -1:
                            setModalState(0)
                            setVisible(false);
                            break;
                        default:
                            return false;
                    }
                }}
            ></BuyModal>
        </div>
    );
};

export default Buy;

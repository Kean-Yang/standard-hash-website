import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Alert, Statistic } from 'antd';
import BuyButton from '../../components/BuyButton/index.tsx';
import InputBoxMount from '../../components/InputaMount/index.tsx';
import UnlockWalletpage from '../../components/UnlockWallet/UnlockWalletpage.tsx';
import { useWallet } from 'use-wallet';
import { contractTransaction } from '../../utils/ContractTransaction.js';
import * as Tools from '../../utils/Tools';
import {
    ApiAppStake,
    ApiAppWithdraw,
    ApiAppClaim,
    ApiAppTotalTakes,
    ApiToClaimBalances,
    ApiAppUserBalances,
    ApiAppSupply,
    ApiLatestepochReward,
    ApiUserStaked,
    ApiAppSellprice,
    ApiTotalRewarded,
    ApiAppTotalBurnt,
    ApiPartialclaim
} from '../../services/index.js';
import {
    REWARD_SYMBOL,
    OFFICIAL_SYMBOL,
    EXECUTION_TIME,
    DEFAULT_CURRENT_PRICE,
    TimeLength,
    StartEpoch
} from '../../constants';
import BuyModal from '../../components/ConfModal/index.tsx';
import './mine.scss';

const Mine = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, status } = wallet;
    const { Countdown } = Statistic;
    const [amount, setAmount] = useState(0); // 输入框值
    const [stakeButLoading, setStakeButLoading] = useState(false); // stake加载状态
    const [estimatedClaimNum, setEstimatedClaimNum] = useState(0); // 预估claim
    const [claimButLoading, setClaimButLoading] = useState(false); // claim加载状态
    const [partialButLoading, sePpartialButLoading] = useState(false); // 多次未领取加载状态
    const [stopButLoading, setStopButLoading] = useState(false); // stop加载状态
    const [apy, setApy] = useState(0); // APY
    const [tokenStaken, setTokenStaken] = useState(0); // 总抵押量
    const [user, setUser] = useState({}); // 用户余额
    const [stakedRate, setStakedRate] = useState(0); // stakedRate // 总质押量/总流通量
    const [userStaked, setUStaked] = useState(0); // 当前用户的质押量
    const [rewardToClaim, setRewardToClaim] = useState(0); // 用户可领取的奖励
    const [btcInfo, setBtcInfo] = useState(0); // BTC当日价格 昨日分发BTC
    const [isWithdraw, setIsWithdraw] = useState(false); // 是否Claim
    const [showBtcInfoErr, setShowBtcInfoErr] = useState({
        code: 200,
        msg: '',
    }); // BTC当日价格 昨日分发BTC
    const [disabled, setDisabled] = useState(true); // 按钮状态
    const [totalRewarded, setTotalRewarded] = useState(0); // 全网总奖励
    const [visible, setVisible] = useState(false);
    const [modalState, setModalState] = useState(0); // 弹窗 0:授权 1授权中 2交易中 3交易成功 -1交易失败; 4 授权完成
    const getInputaMountNumber = (val) => {
        setAmount(val);
        setDisabled(val <= 0);
    };

    const [receive, setReceive] = useState(false); // 多期未领取
    const [epoch, setEpoch] = useState({ currentEpoch: 0, nextEpoch: 0 }); // 当前epoch，下一个epoch时间
    // START;
    const startFun = () => {
        ApiAppStakeFun();
    };
    // CLAIM;
    const claimFun = () => {
        ApiAppClaimFun();
    };
    // STOP
    const stopFun = () => {
        ApiAppWithdrawFun();
    };

    // 当前价格 current Price
    const getApiAppSellprice = async () => {
        ApiAppSellprice()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    getApiLatestepochReward(res.data.price_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                return false;
            });
    };

    // BTC当日价格 昨日分发BTC
    const getApiLatestepochReward = async (price) => {
        await ApiLatestepochReward()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setBtcInfo(res.data.reward.amount_pretty);
                    // 年化收益率 = 金日收益 × 当日BTC价格 / dhm 价格 / 总抵押数量 *365
                    // 年化收益率 = 总奖励 * 当日BTC价格 / 总抵押数量 / dhm 价格 /epochs * 365

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
                setBtcInfo(0);
                setApy(0);
                return 0;
            });
    };

    // 质押
    const ApiAppStakeFun = async () => {
        setStakeButLoading(true);
        const max = user.dhm_pretty;
        const isMax = amount.toString() === max ? true : false;
        await ApiAppStake(account, isMax ? '-1' : amount)
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
                                setModalState(4);
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
                                            setStakeButLoading(false);
                                            getApiAppTotalTakes();
                                            getApiAppUserBalances(); // 余额
                                            getApiUserStaked(); // 用户质押量
                                            getApiToClaimBalances(); //用户可领取的奖励
                                        }, EXECUTION_TIME);
                                    },
                                    () => {
                                        setModalState(-1);
                                        setStakeButLoading(false);
                                        message.warning(t('v1_Failed'));
                                    }, true,
                                    () => {
                                        setStakeButLoading(false);
                                        setVisible(false);
                                        setModalState(4);
                                    }
                                );
                            },
                            () => {
                                setVisible(false);
                                setStakeButLoading(false);
                                setModalState(0);
                                message.warning(t('v1_Failed'));
                            }, true,
                            () => {
                                setStakeButLoading(false);
                                setVisible(false);
                                setModalState(0);
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
                                // setModalnfoState(1);
                                message.warning(t('v1_Pendding'));
                                setTimeout(() => {
                                    setModalState(3);
                                    setStakeButLoading(false);
                                    getApiAppTotalTakes();
                                    getApiAppUserBalances(); // 余额
                                    getApiUserStaked(); // 用户质押量
                                    getApiToClaimBalances(); //用户可领取的奖励
                                }, EXECUTION_TIME);
                            },
                            () => {
                                setModalState(-1);
                                setStakeButLoading(false);
                                message.warning(t('v1_Failed'));
                            }, true,
                            () => {
                                setStakeButLoading(false);
                                setVisible(false);
                                setModalState(4);
                            }
                        );
                    }
                } else {
                    setStakeButLoading(false);
                    message.warning(t('v1_Failed'));
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setStakeButLoading(false);
                setVisible(false);
                return false;
            });
    };
    // Withdraw
    const ApiAppWithdrawFun = async () => {
        setStopButLoading(true);
        await ApiAppWithdraw(account)
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    contractTransaction(
                        account,
                        res.data.txs[0].contract,
                        res.data.txs[0].calldata,
                        () => {
                            setStopButLoading(false);
                            message.warning(t('v1_Pendding'));
                            setTimeout(() => {
                                getApiAppUserBalances(); // 余额
                                getApiUserStaked(); // 用户质押量
                                getApiToClaimBalances(); //用户可领取的奖励
                                setIsWithdraw(false);
                            }, EXECUTION_TIME);
                        },
                        () => {
                            setStopButLoading(false);
                            message.warning(t('v1_Failed'));
                        }, true,
                        () => {
                            setStopButLoading(false);
                        }
                    );
                } else {
                    setStopButLoading(false);
                    message.warning(t('v1_Failed'));
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setStopButLoading(false);
                return false;
            });
    };

    // claim
    const ApiAppClaimFun = async () => {
        setClaimButLoading(true);
        await ApiAppClaim(account)
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    contractTransaction(
                        account,
                        res.data.txs[0].contract,
                        res.data.txs[0].calldata,
                        () => {
                            setClaimButLoading(false);
                            message.warning(t('v1_Pendding'));
                            setTimeout(() => {
                                getApiAppUserBalances();
                                getApiToClaimBalances();
                            }, EXECUTION_TIME);
                        },
                        () => {
                            setClaimButLoading(false);
                            message.warning(t('v1_Failed'));
                        },
                        true,
                        () => {
                            setClaimButLoading(false);
                        }
                    );
                } else {
                    setClaimButLoading(false);
                    message.warning(t('v1_Failed'));
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setClaimButLoading(false);
                return false;
            });
    };


    const ApiPartialclaimFun = async () => {
        sePpartialButLoading(true);
        await ApiPartialclaim()
            .then((res) => {
                if (res.code === 200) {
                    contractTransaction(
                        account,
                        res.data.txs[0].contract,
                        res.data.txs[0].calldata,
                        () => {
                            sePpartialButLoading(false);
                            message.warning(t('v1_Pendding'));
                            setTimeout(() => {
                                getApiAppUserBalances();
                                getApiToClaimBalances();
                            }, EXECUTION_TIME);
                        },
                        () => {
                            sePpartialButLoading(false);
                            message.warning(t('v1_Failed'));
                        }, true,
                        () => {
                            sePpartialButLoading(false);
                        }
                    );
                } else {
                    sePpartialButLoading(false);
                    message.warning(t('v1_Failed'));
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                sePpartialButLoading(false);
                return false;
            });
    };

    // 总抵押量
    const getApiAppTotalTakes = async () => {
        await ApiAppTotalTakes()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setTokenStaken(res.data.amount_pretty);
                    getApiAppTotalBurnt(res.data.amount_pretty);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setTokenStaken(0);
                return 0;
            });
    };

    // 当前用户质押量
    const getApiUserStaked = async () => {
        await ApiUserStaked(account)
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setUStaked(res.data.amount_pretty || 0);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setUStaked(0);
                return 0;
            });
    };
    // 用户可领取的奖励
    const getApiToClaimBalances = async () => {
        await ApiToClaimBalances(account)
            .then((res) => {
                if (res.code === 200) {
                    setRewardToClaim(res.data.amount_pretty || 0);
                } else if (res.code === 1005) {
                    console.log('Receive');
                    setReceive(true);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setRewardToClaim(0);
                return 0;
            });
    };

    // 全网总奖励
    const getApiTotalRewarded = async () => {
        await ApiTotalRewarded()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setTotalRewarded(
                        res.data.amount_pretty || 0
                    );
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setTotalRewarded(0);
                return 0;
            });
    };

    // 总校销毁量 total Burned
    const getApiAppTotalBurnt = async (totalSupply) => {
        ApiAppTotalBurnt()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    getApiAvailable(totalSupply, res.data.total_pretty || 0);
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                getApiAvailable(0)
                return 0;
            });
    };

    // 流通量
    const getApiAvailable = async (staken, totalBurnt) => {
        await ApiAppSupply()
            .then((res) => {
                // console.log(res);
                if (res.code === 200) {
                    setStakedRate(
                        res.data.amount_pretty <= 0
                            ? 0
                            : Tools.fmtDec(
                                Tools.div(
                                    staken,
                                    Tools.sub(
                                        res.data.amount_pretty,
                                        totalBurnt
                                    )
                                ),
                                4
                            )
                    );
                }
            })
            .catch((err) => {
                console.log('发生错误！', err);
                setStakedRate(0)
                return 0;
            });
    };

    // 余额
    const getApiAppUserBalances = async () => {
        await ApiAppUserBalances(account)
            .then((res) => {
                // console.log('ApiAppUserBalances:', res);
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

    useEffect(() => {
        if (account && status === 'connected') {
            getApiTotalRewarded();
            getApiAppSellprice();
        }
    }, [status, account]);

    useEffect(() => {
        // 当前epoch = 向下取整(当前时间/86400 )
        // 下一个epoch时间 = 当前epoch+1 * 86400
        const currentEpoch = Math.floor(Tools.div(Number(new Date().getTime()) / 1000, TimeLength));
        const epoch = Tools.sub(currentEpoch, StartEpoch);
        const nextEpoch = Math.floor(Tools.mul(Tools.plus(currentEpoch, 1), TimeLength * 1000));
        setEpoch({ currentEpoch: epoch, nextEpoch: nextEpoch });
    }, []);

    useEffect(() => {
        getApiAppTotalTakes();
    }, []);

    useEffect(() => {
        if (account && status === 'connected') {
            getApiAppUserBalances(); // 余额
            getApiUserStaked(); // 用户质押量
            getApiToClaimBalances(); //用户可领取的奖励
        }
    }, [account, status]);

    // claim 随时间增长
    useEffect(() => {
        let timers = undefined;
        if (timers) {
            clearInterval(timers);
        }
        const setClaimNumer = (val, dayIncome = 0.02, time = 50) => {
            // if (Tools.GT(val, 0)) {
            let maxNumer = Tools.plus(val, dayIncome);  // 当日最大可收益
            let secondIncome = Tools.div(dayIncome, 86400000) // 每毫秒收益
            let date = Tools.plus(new Date(new Date().toLocaleDateString()).getTime(), 28800000) // 上午八点到目前时长毫秒
            let LengthTime = 0;

            if (!isWithdraw) {
                if (new Date().getTime() <= date) { // 12点以后
                    LengthTime = Tools.plus(Math.abs(Tools.sub(new Date().getTime(), new Date(new Date().toLocaleDateString()).getTime())), 57600000);
                    // val = Tools.plus(Tools.plus(Number(val), Number(LengthTime) * Number(secondIncome)), (dayIncome / 3) * 2)
                    val = Tools.plus(Number(val), Tools.mul(Number(LengthTime), Number(secondIncome)));
                    // console.log(val)
                } else { // 12 点前
                    LengthTime = Tools.sub(new Date().getTime(), date); // 上午八点到目前的收益
                    val = Tools.plus(Number(val), Tools.mul(Number(LengthTime), Number(secondIncome)))
                    // console.log('12点以前', Tools.sub(secondIncome, Tools.sub(date, new Date().getTime())))
                }
            } else {
                val = 0;
            }

            var income = val;
            if (Tools.LT(estimatedClaimNum, maxNumer)) {
                timers = setInterval(() => {
                    income = Tools.plus(Number(income), Number(secondIncome));
                    // console.log(Number(income).toFixed(14))
                    setEstimatedClaimNum(Number(income).toFixed(14));
                }, time);
            } else {
                setEstimatedClaimNum(maxNumer);
                clearInterval(timers);
            }
        }

        if (!isWithdraw && userStaked > 0) {
            // 用户质押数/全网质押数*当日分发数
            // console.log((0.2 / 1000000) * userStaked);
            let mydayIncome = Tools.fmtDec((Number(Tools.div(userStaked, tokenStaken))) * 0.10648791, 8)
            setClaimNumer(0, mydayIncome);
        } else {
            clearInterval(timers);
        }

        return () => {
            clearInterval(timers);
        }
    }, [userStaked, isWithdraw, tokenStaken]);


    return (
        <div className="mine-page">

            {wallet && !account && status !== 'connected' ? (
                <UnlockWalletpage />
            ) : (
                    <>

                        <div className="epoch-content">
                            <div className="epoch">
                                {t('v1_EPOCH_IN_PROGRESS', { x: epoch.currentEpoch || 0 })} &nbsp; <Countdown value={epoch.nextEpoch || 0} format="HH:mm:ss:SSS" />
                            </div>
                        </div>

                        <div className="mine-body">

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
                            <div className="total">
                                <div className="earn">{t('v1_EARN_wBTC', { x: REWARD_SYMBOL || 'wBTC' })}</div>
                                <div className="amount">
                                    {
                                        Tools.toThousands(
                                            Tools.fmtDec(totalRewarded || 0, 4)
                                        ) || 0
                                    }&nbsp;{REWARD_SYMBOL}
                                </div>
                                <div className="desc">{t('v1_wBTC_DH_DAY')}</div>
                            </div>

                            <div className="mine-content">
                                <div className="data-item">
                                    <div className="data">
                                        <div className="data-border">
                                            <div className="text price">
                                                {t('v1_DHM_TOKEN_STAKED')}
                                            </div>
                                            <div className="amount ">
                                                {Tools.toThousands(
                                                    Tools.fmtDec(userStaked, 4)
                                                ) || 0}
                                            </div>
                                            <div className="start">
                                                <InputBoxMount
                                                    balance={Tools.fmtDec(user.dhm_pretty || 0, 4)}
                                                    maxBalance={Tools.fmtDec(user.dhm_pretty || 0, 4)}
                                                    width={'250'}
                                                    onConfirm={getInputaMountNumber}
                                                    sumbol={OFFICIAL_SYMBOL}
                                                />
                                            </div>
                                            <BuyButton
                                                loading={stakeButLoading}
                                                butText={t('v1_START')}
                                                disabled={
                                                    disabled || user.dhm_pretty <= 0
                                                }
                                                butClassName={'operation-lightBox-but'}
                                                onChangeFun={startFun}
                                            />
                                        </div>
                                    </div>
                                    <p className="desc">{t('v1_Only_one_stake_epoch')}</p>
                                    <p></p>
                                </div>
                                <div className="rate">
                                    <p className="amount">
                                        {Tools.toThousands(
                                            Number(btcInfo) <= 0
                                                ? 0
                                                : Tools.fmtDec(btcInfo, 4) || 0
                                        )}
                                &nbsp;{REWARD_SYMBOL}
                                    </p>
                                    <p className="text">{t('v1_Rewards_Today')}</p>
                                    <p className="amount">
                                        {Tools.toThousands(Tools.fmtDec(tokenStaken, 4) || 0)}

                                        {/* {t('v_1real') ? Tools.toThousands(tokenStaken) || 0 : Number(tokenStaken) > 85000 ? Tools.sub(Number(tokenStaken), 85000) : Tools.toThousands(tokenStaken)} */}
                                        {/* {Tools.toThousands(tokenStaken)} */}
                                    </p>
                                    <p className="text">{t('v1_Total_Staked')}</p>
                                    <p className="amount">
                                        {isNaN(stakedRate)
                                            ? 0
                                            : Tools.toThousands(
                                                Tools.fmtDec(stakedRate * 100, 2)
                                            ) || 0}
                                %
                            </p>
                                    <p className="text">{t('v1_Staked_Rate')}</p>
                                </div>
                                <div className="data-item">
                                    <div className="data">
                                        <div className="data-border">
                                            <div className="apy">
                                                <span>{t('v1_APY')}</span>
                                                <span>
                                                    {(isNaN(apy) ? 0 : Tools.numFmt(apy * 100, 2)) || 0}
                                            %
                                        </span>
                                            </div>

                                            <div className="amount price">
                                                {Tools.toThousands(
                                                    Tools.numFmt(Tools.fmtDec(rewardToClaim || 0, 8), 8) || 0
                                                )}
                                            </div>

                                            <div className="text ">
                                                {t('v1_wBTC_EARNED', { x: REWARD_SYMBOL || 'wBTC' })}
                                            </div>

                                            <div className="rewards-today">
                                                <p> {estimatedClaimNum}   {REWARD_SYMBOL || 'wBTC'}</p>
                                                <p> {t("v1_Estimated_RewardsToday")}</p>
                                            </div>
                                            <div className="claim">
                                                <BuyButton
                                                    loading={claimButLoading}
                                                    butText={t('v1_CLAIM')}
                                                    disabled={rewardToClaim <= 0}
                                                    butClassName={
                                                        'operation-lightBox-but'
                                                    }
                                                    onChangeFun={claimFun}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="desc">
                                        {t('v1_calculated_income_EST')}
                                    </p>
                                    <p className="desc">{t('v1_Settlement_date')}</p>
                                </div>
                            </div>

                            <BuyButton
                                loading={stopButLoading}
                                butText={t('v1_STOP')}
                                disabled={userStaked <= 0}
                                butClassName={'operation-dark-but'}
                                onChangeFun={stopFun}
                            />

                            {receive ? <BuyButton
                                loading={partialButLoading}
                                butText={t('v1_CLAIM_IN_BATCHES')}
                                disabled={false}
                                butClassName={
                                    'operation-lightBox-but'
                                }
                                onChangeFun={ApiPartialclaimFun}
                            /> : ""}

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
                                        ? t('v1_You_will_staked')
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
                                                    ? t('v1_BACK')
                                                    : modalState === 4
                                                        ? t('v1_START')
                                                        : modalState === -1
                                                            ? t('v1_BACK')
                                                            : ''

                                    // v1_Approve
                                }
                                buyFun={() => {
                                    switch (modalState) {
                                        case 0:
                                            ApiAppStakeFun();
                                            break;
                                        case -1:
                                            setModalState(0)
                                            setVisible(false);
                                            break;
                                        default:
                                            setModalState(0)
                                            setVisible(false);
                                            return false;
                                    }
                                }}
                            ></BuyModal>
                            <p className="clues">{t('v1_automagically_wbtc', { x: REWARD_SYMBOL || 'wBTC' })}</p>
                        </div>
                    </>
                )}
        </div>

    );
};

export default Mine;

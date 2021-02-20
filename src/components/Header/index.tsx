import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from 'antd';
import { AppMenuMobile } from '../../Layout/app.menu';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import whitepaper from '../../assets/whitepaper.svg';
import walletImg from '../../assets/wallet.svg';
import './index.scss';
import { useWallet } from 'use-wallet';
import { WHIEPAPER_URL, INIT_SYMBOL } from '../../constants';
import * as Tools from '../../utils/Tools';
import { useMedia } from 'react-use';
import DesktopMenu from './DesktopMenu.tsx';
import { ApiAppUserBalances } from '../../services';

const PageHeader = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { account, connect, status } = wallet;
    const history = useHistory();
    const below960 = useMedia('(max-width: 960px)');
    const [visible, setVisible] = useState(false);
    const [balance, setBalance] = useState(0);

    const showDrawer = () => {
        setVisible(!visible);
    };
    const onClose = () => {
        setVisible(false);
    };

    const jumpPage = (url) => {
        history.push(url);
        setVisible(false);
    };

    useEffect(() => {
        if (account && status === 'connected') {
            // 用户余额
            ApiAppUserBalances(account)
                .then((res) => {
                    if (res.code === 200) {
                        setBalance(Tools.fmtDec(res.data.usdt_pretty || 0, 4));
                    }
                })
                .catch((err) => {
                    console.log('发生错误！', err);
                    setBalance(0);
                    return 0;
                });
        }
    }, [account, status]);

    return (
        <header className="page-header">
            <div className="header">
                {!below960 ? (
                    <div className="nav-logo">
                        <a href="/" onClick={() => onClose()}>
                            <img src={logo} alt="" />
                        </a>
                    </div>
                ) : (
                        <div className="nav-logo" onClick={() => showDrawer()}>
                            <img src={logo} alt="" />
                        </div>
                    )}

                <div className="nav-whitepaper">
                    <a
                        href={WHIEPAPER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={whitepaper} alt="" />
                        {t('v1_WHITEPAPER')}
                    </a>
                </div>

                <div className="nav">
                    {!below960 ? (
                        <div className="nav-link">
                            <DesktopMenu />
                        </div>
                    ) : (
                            ''
                        )}

                    {!window.web3 ? (
                        <div className="nav-Wallet">
                            <a
                                href="https://metamask.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('v1_Install_MetaMask')}
                            </a>
                        </div>
                    ) : !wallet || status !== 'connected' ? (
                        <div
                            className="nav-Wallet"
                            onClick={() => {
                                if (status !== 'connected') {
                                    console.log('wallet');
                                    connect();
                                }
                            }}
                        >
                            <>
                                <img src={walletImg} alt="" />
                                {t('v1_Connect_Wallet')}
                            </>
                        </div>
                    ) : (
                                <div className="nav-Wallet-account">
                                    {wallet && account ? (
                                        <>
                                            <span className="balance">
                                                {balance}
                                                {INIT_SYMBOL}
                                            </span>
                                            <span className="account">
                                                {Tools.substringTx(account) || ''}
                                            </span>
                                        </>
                                    ) : (
                                            account
                                        )}
                                </div>
                            )}
                </div>

                <p className="keyworder">{t('v1_Decentralized_hash_mining')}</p>
                {/* {below960 ? ( */}
                <>
                    {/* <Button type="primary" onClick={showDrawer}>
                            Open
                        </Button> */}
                    <Drawer
                        title={
                            <img
                                onClick={() => showDrawer()}
                                src={logo}
                                alt=""
                            />
                        }
                        placement="top"
                        mask
                        className="menuMobile"
                        maskClosable
                        closable
                        height="auto"
                        onClose={onClose}
                        visible={visible}
                    >
                        {AppMenuMobile &&
                            AppMenuMobile.map((item, index) => {
                                return (
                                    <p
                                        key={`${item.key} ${index}`}
                                        onClick={() => jumpPage(item.url)}
                                    >
                                        {t(`${item.name}`) || ''}{' '}
                                        {item.childrenName || ''}
                                    </p>
                                );
                            })}
                    </Drawer>
                </>
                {/* ) : (
                    ''
                )} */}
            </div>
        </header>
    );
};

export default PageHeader;

import React from 'react';
import { useTranslation } from 'react-i18next';
// import { Alert } from 'antd'
import { useWallet } from 'use-wallet';
import './UnlockWallet.scss';

const UnlockWalletpage = () => {
    const { t } = useTranslation();
    const wallet = useWallet();
    const { connect } = wallet;

    return (
        <div className="UnlockWalletpage">

            {/* <div>
                <Alert
                    message="Informational Notes"
                    description="Additional description and information about copywriting."
                    type="info"
                    showIcon
                />
            </div> */}
            {!window.web3 ? (
                <div className="UnlockWalletpage-content">
                    <a
                        href="https://metamask.io/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('v1_Install_MetaMask')}
                    </a>
                </div>
            ) : (
                    <div
                        className="UnlockWalletpage-content"
                        onClick={() => {
                            connect();
                        }}
                    >
                        {t('v1_Unlock_Wallet')}
                    </div>
                )}
        </div>
    );
};

export default UnlockWalletpage;

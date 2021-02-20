import React, { useState } from 'react';
import { Modal } from 'antd';
// import { useWallet } from 'use-wallet';
import { useMedia } from 'react-use';
// import { CHAINID } from '../../constants';
import BuyButton from '../BuyButton/index.tsx';
import './network.scss';

const SwitchNetwork = ({ text, visible = true }) => {
    // const wallet = useWallet();
    // const { chainId, status, account } = wallet;
    const below960 = useMedia('(max-width: 960px)');
    const [visibleModal, setVisibleModal] = useState(visible || false);
    // useEffect(() => {
    //     if (status && chainId && account) {
    //         setVisible(false);
    //     } else {
    //         if (
    //             chainId && chainId !== 1 && status !== 'connected'
    //         ) {
    //             // 显示网络错误
    //             setVisible(true);
    //         } else {
    //             setVisible(false);
    //         }
    //     }
    // }, [chainId, status]);

    return (
        <Modal
            footer={null}
            title={null}
            visible={visibleModal}
            width={!below960 ? 'auto' : '80%'}
            centered
            closable={false}
        >
            <div className="network-modal">
                <div className="network-modal-content">
                    <div className="text">{text}</div>

                    <BuyButton
                        butText={'OK'}
                        butClassName={'network-lightblue-but'}
                        onChangeFun={() => {
                            setVisibleModal(false);
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SwitchNetwork;

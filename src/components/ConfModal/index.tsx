import React from 'react';
import { Modal } from 'antd';
import './index.scss';
import { useMedia } from 'react-use';
import BuyButton from '../BuyButton/index.tsx';
import * as Tools from '../../utils/Tools';

const BuyModal = ({
    visible,
    amount,
    text,
    butText,
    buyFun,
    buyButloading,
    disabled,
}) => {
    const below960 = useMedia('(max-width: 960px)');

    return (
        <Modal
            footer={null}
            title={null}
            visible={visible}
            width={!below960 ? 'auto' : '80%'}
            centered
            closable={false}
            style={{
                borderRadius: '15px',
            }}
            bodyStyle={{
                borderRadius: '15px',
            }}
        >
            <div className="buy-modal">
                <div className="buy-modal-content">
                    <div className="text">{text || ''}</div>
                    <div className="amount">{Tools.numFmt(amount, 4) || 0}</div>
                    <div className="wei">{'DHM' || ''}</div>

                    <BuyButton
                        butText={butText}
                        disabled={disabled}
                        loading={buyButloading}
                        butClassName={'operation-lightblue-but'}
                        onChangeFun={buyFun}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default BuyModal;

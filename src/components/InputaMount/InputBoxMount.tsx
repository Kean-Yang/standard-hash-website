import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    INIT_SYMBOL
} from '../../constants';
import './index.scss';

const InputBoxMount = ({ onConfirm, placeholder, balance }) => {
    const { t } = useTranslation();
    const below960 = useMedia('(max-width: 960px)');
    const onChange = (value) => {
        console.log('changed', value);
        onConfirm(value);
    };
    const onChangeMaxBalance = () => {
        onConfirm(balance);
    };

    return (
        <div className="InputaBoMount">
            <div className="inputaMount-content">
                <div className="input">
                    <input
                        min={0}
                        max={balance}
                        type="number"
                        defaultValue={''}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                    <div className="conf">
                        <div className="max" onChange={onChangeMaxBalance}>
                            MAX
                        </div>
                        <span>{INIT_SYMBOL}</span>
                    </div>
                </div>

                <p className="balance">
                    {t('v1_Balance', { x: balance || 0 })}
                </p>
            </div>
        </div>
    );
};

export default InputBoxMount;

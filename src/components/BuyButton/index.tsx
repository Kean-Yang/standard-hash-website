import React from 'react';
import { Button } from 'antd';
import './BuyButton.scss';

const BuyButton = ({
    butText,
    butClassName,
    onChangeFun,
    loading,
    disabled,
}) => {
    return (
        <div className="BuyButton">
            <div className="BuyButton-content">
                <Button
                    className={butClassName}
                    loading={loading}
                    disabled={disabled}
                    onClick={() => onChangeFun()}
                >
                    {butText}
                </Button>
            </div>
        </div>
    );
};

export default BuyButton;

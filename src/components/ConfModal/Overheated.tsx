import React from 'react';
import { Statistic } from 'antd';
import { useMedia } from 'react-use';
import './Overheated.scss';
const { Countdown } = Statistic;

const Overheated = ({ text, visible = true, deadline }) => {
    const below960 = useMedia('(max-width: 960px)');
    return (
        <>
            {visible ? <div
                width={!below960 ? 'auto' : '80%'}
                className="overheated-modal"
            >
                <div className="network-modal">
                    <div className="network-modal-content">
                        <div className="text">{text}</div>
                        {deadline ? <Countdown value={deadline} format="HH:mm:ss:SSS" /> : ""}
                    </div>
                </div>
            </div> : ""}
        </>
    );
};

export default Overheated;

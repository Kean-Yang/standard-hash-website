import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { UseWalletProvider } from 'use-wallet';
import zhCN from 'antd/lib/locale/zh_CN';
import './i18n/I18n';
import './index.scss';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './styles/styles.scss';
import { CHAINID } from './constants/index';

ReactDOM.render(
    <UseWalletProvider chainId={CHAINID}>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </UseWalletProvider>,
    document.getElementById('root')
);
reportWebVitals();

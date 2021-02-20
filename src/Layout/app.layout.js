/**
 *
 * @author
 * @create
 */

import React from 'react';
import { Layout } from 'antd';
import { PagesRouter } from './app.pages.route';
import PageFooter from '../components/Footer/index.tsx';
import PageHeader from '../components/Header/index.tsx';
// import SwitchNetwork from "../components/UnlockWallet/network.tsx";
// import Overheated from "../components/ConfModal/Overheated.tsx";
import './app.layout.scss';
// import { useTranslation } from 'react-i18next';
const { Content } = Layout;

const DdRoute = () => {
    // const { t } = useTranslation();
    return (
        <Layout className="app-layout">
            <PageHeader />
            {/* <SwitchNetwork text={t('maintenanceContent')} visible={true} /> */}
            {/* {t('v1_overheated') ? <Overheated text={t('v1_overheated')} deadline={Number(t('deadline'))} visible={true} /> : ""} */}
            <Content className="layout-content">
                <PagesRouter />
            </Content>
            <PageFooter />
        </Layout>
    );
};

export default DdRoute;

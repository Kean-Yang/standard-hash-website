import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Card, Form, Input, Button } from 'antd';
import { useMedia } from 'react-use';
import './management.scss';

const Management = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const below960 = useMedia('(max-width: 960px)');
    const [form] = Form.useForm();
    const onChange = (checked) => {
        setLoading(!checked);
    };
    const gridStyle = {
        width: !below960 ? '33.33%' : '100%',
        textAlign: 'left',
        padding: !below960 ? '20px 24px' : '10px',
        fontSize: '16px',
        lineHeight: '22px',
    };
    const gridTitleStyle = {
        fontSize: '16px',
        fontWeight: 500,
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const tailLayout = {
        wrapperCol: { offset: 4, span: 20 },
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    // 设置from
    // const onFill = () => {
    //     form.setFieldsValue({
    //         sellPrice: 'Hello world!',
    //         ProfitNextDay: 'Hello world!',
    //         RecyclePrice: 'Hello world!',
    //     });
    // };

    return (
        <div className="management-page">
            <Switch checked={!loading} onChange={onChange} />

            <Card
                title={t('v1_admin_STATS')}
                style={{
                    width: !below960 ? 960 : '86%',
                    padding: '24px',
                    margin: '24px auto',
                }}
                loading={loading}
                hoverable={false}
            >
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Marcket_price')}:
                    <span style={gridTitleStyle}> 123 HUSD</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Miner_price')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_FPPS_Mining_Earnings')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_BTC_Price')}:
                    <span style={gridTitleStyle}> 123 HUSD</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Distribution')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Recycle_Price')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
            </Card>

            <Card
                title={t('v1_admin_TOTAL')}
                style={{
                    width: !below960 ? 960 : '86%',
                    padding: '24px',
                    margin: '24px auto',
                }}
                loading={loading}
                hoverable={false}
            >
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_All-time BTC Mined')}:
                    <span style={gridTitleStyle}> 123 BTC</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Distribution')}
                    <span style={gridTitleStyle}> 123 wBTC</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_Blance_Fund')}：
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_admin_BTC_Price')}
                    <span style={gridTitleStyle}> 123 HUSD</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_Total_supply')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                    {t('v1_Total_Burned')}:
                    <span style={gridTitleStyle}>123</span>
                </Card.Grid>
            </Card>

            <div className="management-from">
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="sellPrice"
                        label={t('v1_admin_Sell_price')}
                        rules={[{ required: false }]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item
                        name="ProfitNextDay"
                        label={t('v1_admin_Profit_next_Day')}
                        rules={[{ required: false }]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item
                        name="RecyclePrice"
                        label={t('v1_admin_Recycle_price')}
                        rules={[{ required: false }]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    {/* <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.gender !== currentValues.gender
                        }
                    >
                        {({ getFieldValue }) => {
                            return getFieldValue('gender') === 'other' ? (
                                <Form.Item
                                    name="customizeGender"
                                    label="Customize Gender"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            ) : null;
                        }}
                    </Form.Item> */}

                    <Form.Item {...tailLayout}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="admin-confirm"
                        >
                            {t('v1_admin_Confirm')}
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            onReset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Management;

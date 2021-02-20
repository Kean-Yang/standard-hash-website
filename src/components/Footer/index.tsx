import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppMenuSocial } from '../../Layout/app.menu';
import './index.scss';
import { MINERS_FUND, MINERS_STATS, AUDIT_REPORT } from '../../constants';

const PageFooter = () => {
    const { t } = useTranslation();
    return (
        <footer className="page-footer">
            <div className="certification">
                <p>{t('v1_SUPPORT_BY')}</p>
                <a href={MINERS_FUND} target="_blank" rel="noopener noreferrer">
                    <div className="mb"></div>
                </a>
            </div>

            <div className="certification-miners-stats">
                <p>{t('v1_Miners_stats')}</p>
                <a href={MINERS_STATS} target="_blank" rel="noopener noreferrer">
                    <div className="mb"></div>
                </a>
            </div>

            <div className="certification-audit-report">
                <p>{t('v1_Audit_by')}</p>
                <a href={AUDIT_REPORT} target="_blank" rel="noopener noreferrer">
                    <div className="mb"></div>
                </a>
            </div>

            <div className="contact-us">
                {AppMenuSocial &&
                    AppMenuSocial.map((item, index) => {
                        return (
                            <a
                                href={item.url}
                                key={`${item.key} ${index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={item.icon} alt=""></img>
                            </a>
                        );
                    })}
            </div>
        </footer>
    );
};

export default PageFooter;

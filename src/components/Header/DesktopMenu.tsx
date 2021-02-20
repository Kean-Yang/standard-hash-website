import React from 'react';
import { message } from "antd";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { AppMenu } from '../../Layout/app.menu';
import './index.scss';


const DesktopMenu = () => {
    const { t } = useTranslation();
    const location = useLocation();
    return (
        <>
            <Link
                to={AppMenu[0].url}
                key={`${AppMenu[0].key} 0`}
                className={
                    [`${AppMenu[0].url}`].includes(location.pathname)
                        ? 'active'
                        : ''
                }
            >
                <p>{t(`${AppMenu[0].name}`) || ''}</p>
                <p>{AppMenu[0].childrenName || ''}</p>
            </Link>
            <Link
                to={AppMenu[1].url}
                key={`${AppMenu[1].key} 1`}
                className={
                    [`${AppMenu[1].url}`].includes(location.pathname)
                        ? 'active'
                        : ''
                }
            >
                <p>{t(`${AppMenu[1].name}`) || ''}</p>
                <p>{AppMenu[1].childrenName || ''}</p>
            </Link>


            {!AppMenu[2].target ?
                <a
                    href={AppMenu[2].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${AppMenu[2].name} 2`}
                >
                    <p>{t(`${AppMenu[2].name}`) || ''}</p>
                    <p>{AppMenu[2].childrenName || ''}</p>
                </a> : <a
                    // href={AppMenu[2].url}
                    // href="javascript:void(0);"
                    // target="_blank"
                    // rel="noopener noreferrer"
                    key={`${AppMenu[2].name} 2`}
                    onClick={(e) => {
                        e.preventDefault();
                        message.success({
                            content: 'opening soon',
                            className: 'custom-class',
                            style: {
                                marginTop: '20vh',
                            },
                        });
                    }}
                >
                    <p>{t(`${AppMenu[2].name}`) || ''}</p>
                    <p>{AppMenu[2].childrenName || ''}</p>
                </a>
            }




            <Link
                to={AppMenu[3].url}
                key={`${AppMenu[3].key} 3`}
                className={
                    [`${AppMenu[3].url}`].includes(location.pathname)
                        ? 'active'
                        : ''
                }
            >
                <p>{t(`${AppMenu[3].name}`) || ''}</p>
                <p>{AppMenu[3].childrenName || ''}</p>
            </Link>
        </>
    );
};

export default DesktopMenu;

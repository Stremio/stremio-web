// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const { HorizontalNavBar, Image } = require('stremio/components');
const styles = require('./styles');

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className={styles['not-found-container']}>
            <HorizontalNavBar
                className={styles['nav-bar']}
                title={t('PAGE_NOT_FOUND')}
                backButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            <div className={styles['not-found-content']}>
                <Image
                    className={styles['not-found-image']}
                    src={require('/assets/images/empty.png')}
                    alt={' '}
                />
                <div className={styles['not-found-label']}>{t('PAGE_NOT_FOUND')}</div>
            </div>
        </div>
    );
};

module.exports = NotFound;

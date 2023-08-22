// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { Image, HorizontalNavBar } = require('stremio/common');
const styles = require('./styles');

const NotFound = () => {
    return (
        <div className={styles['not-found-container']}>
            <HorizontalNavBar
                className={styles['nav-bar']}
                title={'Page not found'}
                backButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            <div className={styles['not-found-content']}>
                <Image
                    className={styles['not-found-image']}
                    src={require('/images/empty.png')}
                    alt={' '}
                />
                <div className={styles['not-found-label']}>Page not found!</div>
            </div>
        </div>
    );
};

module.exports = NotFound;

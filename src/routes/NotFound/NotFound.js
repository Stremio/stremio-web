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
            />
            <div className={styles['not-found-content']}>
                <Image
                    className={styles['not-found-image']}
                    src={'/images/empty.png'}
                    alt={' '}
                />
                <div className={styles['not-found-label']}>Page not found!</div>
            </div>
        </div>
    );
};

module.exports = NotFound;

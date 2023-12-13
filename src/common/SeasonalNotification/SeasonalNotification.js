// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const styles = require('./styles');
const { default: Icon } = require('@stremio/stremio-icons/react');
const PropTypes = require('prop-types');
const Button = require('../Button');

const SeasonalNotification = ({ imgUrl, altUrl }) => {

    return (
        <div className={styles['wrapper']}>
            <img className={styles['notification-image']} src={imgUrl} alt={altUrl} />
            <Icon className={styles['back-button']} name={'close'} />
            <div className={styles['info-container']}>
                <div className={styles['title-container']}>
                    <div className={styles['title']}>Ho! Ho! Ho! Are you ready for a Silent Cinema Night?</div>
                    <div className={styles['label']}>Get into the festive spirit with our Christmas movie collection – where holiday magic meets the screen!</div>
                </div>
                <Button className={styles['action-button']}>
                    <div className={styles['label']}>Learn more</div>
                </Button>
            </div>
        </div>
    );
};

module.exports = SeasonalNotification;

SeasonalNotification.propTypes = {
    imgUrl: PropTypes.string.isRequired,
    altUrl: PropTypes.string.isRequired,
};


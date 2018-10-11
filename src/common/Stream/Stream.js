import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import colors from 'stremio-colors';
import styles from './styles';

const renderLogo = (logo, sourceName) => {
    if (logo) {
        return (
            <Icon className={styles['logo']} icon={logo} />
        );
    }

    return (
        <div className={styles['source-name']}>{sourceName}</div>
    );
}

const renderTitle = (title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <div className={styles['title']}>{title}</div>
    );
}

const renderSubtitle = (isFree, isSubscription, subtitle) => {
    if (isFree) {
        return (
            <span className={styles['free-label']}>FREE</span>
        );
    }

    if (isSubscription) {
        return (
            <span className={styles['subscription-label']}>SUBSCRIPTION</span>
        );
    }

    if (subtitle) {
        return (
            <div className={styles['subtitle']}>{subtitle}</div>
        );
    }
    return null;
}

const renderPlay = (progress) => {
    return (
        <div style={{ backgroundColor: progress ? colors.white : null }} className={styles['play-container']}>
            <Icon style={{ fill: progress ? colors.medium : null }} className={styles['play']} icon={'ic_play'} />
        </div>
    );
}

const renderProgress = (progress) => {
    if (progress <= 0) {
        return null;
    }

    return (
        <div className={styles['progress-container']}>
            <div style={{ width: progress + '%' }} className={styles['progress']}></div>
        </div>
    );
}

const Stream = (props) => {
    return (
        <div onClick={props.play} style={{ backgroundColor: props.progress ? colors.black40 : null }} className={styles['stream']}>
            <div className={styles['stream-info-container']}>
                <div className={styles['stream-info']}>
                    {renderLogo(props.logo, props.sourceName)}
                    <div className={styles['text-container']}>
                        {renderTitle(props.title)}
                        {renderSubtitle(props.isFree, props.isSubscription, props.subtitle)}
                    </div>
                </div>
                {renderProgress(props.progress)}
            </div>
            {renderPlay(props.progress)}
        </div>
    );
}

Stream.propTypes = {
    logo: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    isFree: PropTypes.bool.isRequired,
    isSubscription: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    play: PropTypes.func
};

Stream.defaultProps = {
    logo: '',
    sourceName: '',
    title: '',
    subtitle: '',
    isFree: false,
    isSubscription: false,
    progress: 0
};

export default Stream;
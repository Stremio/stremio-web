import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const MAX_SOURCE_NAME_SYMBOLS = 100;
const MAX_TITLE_SYMBOLS = 500;
const MAX_SUBTITLE_SYMBOLS = 500;

const renderLogo = (logo, sourceName) => {
    if (logo) {
        return (
            <div className={styles['logo-container']}>
                <Icon className={styles['logo']} icon={logo} />
            </div>
        );
    }

    return (
        <div className={styles['source-name']}>{sourceName.length > MAX_SOURCE_NAME_SYMBOLS ? sourceName.slice(0, MAX_SOURCE_NAME_SYMBOLS) + '...' : sourceName}</div>
    );
}

const renderTitle = (title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <div className={styles['title']}>{title.length > MAX_TITLE_SYMBOLS ? title.slice(0, MAX_TITLE_SYMBOLS) + '...' : title}</div>
    );
}

const renderSubtitle = (subtitle) => {
    if (subtitle) {
        return (
            <div className={styles['subtitle']}>{subtitle.length > MAX_SUBTITLE_SYMBOLS ? subtitle.slice(0, MAX_SUBTITLE_SYMBOLS) + '...' : subtitle}</div>
        );
    }
    return null;
}

const renderProgress = (progress) => {
    if (progress <= 0) {
        return null;
    }

    return (
        <div className={styles['progress-container']}>
            <div style={{ width: progress + '%' }} className={styles['progress']} />
        </div>
    );
}

const Stream = (props) => {
    return (
        <div onClick={props.onClick} className={classnames(styles['stream-container'], props.className)}>
            <div className={styles['flex-row-container']}>
                {renderLogo(props.logo, props.sourceName)}
                <div className={styles['text-container']}>
                    {renderTitle(props.title)}
                    {renderSubtitle(props.subtitle)}
                </div>
                <div className={styles['play-container']}>
                    <Icon className={styles['play']} icon={'ic_play'} />
                </div>
            </div>
            {renderProgress(props.progress)}
        </div>
    );
}

Stream.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    onClick: PropTypes.func
};

Stream.defaultProps = {
    logo: '',
    sourceName: '',
    title: '',
    subtitle: '',
    progress: 0
};

export default Stream;

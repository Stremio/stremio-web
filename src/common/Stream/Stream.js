import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
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

const renderSubtitle = (subtitle) => {
    if (subtitle) {
        return (
            <div className={styles['subtitle']}>{subtitle}</div>
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
        <div onClick={props.play} className={classnames(styles['stream-container'], { [styles['active']]: props.progress })}>
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
    logo: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    play: PropTypes.func
};

Stream.defaultProps = {
    logo: '',
    sourceName: '',
    title: '',
    subtitle: '',
    progress: 0
};

export default Stream;

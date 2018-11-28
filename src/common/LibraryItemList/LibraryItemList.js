import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderPoster = (play, poster) => {
    if (poster.length === 0) {
        return null;
    }

    return (
        <div className={styles['poster']} style={{ backgroundImage: 'url(' + poster + ')' }}>
            <div onClick={play} className={styles['play-container']}>
                <Icon className={styles['play']} icon={'ic_play'} />
            </div>
        </div>
    );
}

const renderTitle = (title) => {
    if (title.length === 0) {
        return null;
    }

    return (
        <span className={styles['title']}>{title}</span>
    );
}

const renderType = (type) => {
    if (type.length === 0) {
        return null;
    }

    return (
        <span className={styles['type']}>{type}</span>
    );
}

const renderReleasedInfo = (releaseInfo) => {
    if (isNaN(releaseInfo.getTime())) {
        return null;
    }

    return (
        <span className={styles['year']}>{releaseInfo.getFullYear()}</span>
    );
}

const renderReleasedDate = (released) => {
    if (isNaN(released.getTime())) {
        return null;
    }

    return (
        <span className={styles['date-added']}>{released.getDate() + '.' + released.getMonth() + '.' + released.getFullYear()}</span>
    );
}

const renderLastViewed = (lastViewed) => {
    if (isNaN(lastViewed.getTime())) {
        return null;
    }

    return (
        <span className={styles['last-viewed']}>{lastViewed.getDate() + '.' + lastViewed.getMonth() + '.' + lastViewed.getFullYear()}</span>
    );
}

const LibraryItemList = (props) => {
    return (
        <div className={styles['library-item']}>
            {renderPoster(props.play, props.poster)}
            {renderTitle(props.title)}
            {renderType(props.type)}
            {renderReleasedInfo(props.releaseInfo)}
            {renderReleasedDate(props.released)}
            <span className={styles['views']}>{props.views}</span>
            <span className={styles['hours']}>{props.hours}</span>
            {renderLastViewed(props.lastViewed)}
            <div onClick={props.watchTrailer} className={styles['icon-container']}>
                <Icon className={styles['trailer-icon']} icon={'ic_movies'} />
                <div className={styles['trailer']}>Trailer</div>
            </div>
            <div onClick={props.addToLibrary} className={styles['icon-container']}>
                <Icon className={styles['addlib-icon']} icon={'ic_addlib'} />
                <div className={styles['addlib']}>Add to Library</div>
            </div>
        </div>
    );
}

LibraryItemList.propTypes = {
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    releaseInfo: PropTypes.instanceOf(Date).isRequired,
    released: PropTypes.instanceOf(Date).isRequired,
    views: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    lastViewed: PropTypes.instanceOf(Date).isRequired,
    play: PropTypes.func,
    watchTrailer: PropTypes.func,
    addToLibrary: PropTypes.func
};
LibraryItemList.defaultProps = {
    poster: '',
    title: '',
    type: '',
    releaseInfo: new Date(''), 
    released: new Date(''), //Invalid Date
    views: 0,
    hours: 0,
    lastViewed: new Date('')
};

export default LibraryItemList;
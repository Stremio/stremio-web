import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

const renderPoster = (props, poster) => {
    if (poster.length === 0) {
        return null;
    }

    return (
        <div className={styles['poster']} style={{ backgroundImage: 'url(' + poster + ')' }}>
            <div onClick={props.playButtonClicked} className={styles['play-container']}>
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

const renderYear = (year) => {
    if (year.length === 0) {
        return null;
    }

    return (
        <span className={styles['year']}>{year}</span>
    );
}

const renderDateAdded = (dateAdded) => {
    if (isNaN(dateAdded.getTime())) {
        return null;
    }

    return (
        <span className={styles['date-added']}>{dateAdded.getDate() + '.' + (dateAdded.getMonth() === 0 ? dateAdded.getMonth() + 12 : dateAdded.getMonth()) + '.' + dateAdded.getFullYear()}</span>
    );
}

const renderLastViewed = (lastViewed) => {
    if (isNaN(lastViewed.getTime())) {
        return null;
    }

    return (
        <span className={styles['last-viewed']}>{lastViewed.getDate() + '.' + (lastViewed.getMonth() === 0 ? lastViewed.getMonth() + 12 : lastViewed.getMonth()) + '.' + lastViewed.getFullYear()}</span>
    );
}

const renderTrailerIcon = (props) => {
    return (
        <div onClick={props.viewTrailer} className={styles['icon-container']}>
            <Icon className={styles['trailer-icon']} icon={'ic_movies'} />
            <div className={styles['trailer']}>Trailer</div>
        </div>
    );
}

const renderAddlibIcon = (props) => {
    return (
        <div onClick={props.addTolib} className={styles['icon-container']}>
            <Icon className={styles['addlib-icon']} icon={'ic_addlib'} />
            <div className={styles['addlib']}>Add to Library</div>
        </div>
    );
}

const LibraryItemList = (props) => {
    return (
        <div className={styles['library-item']}>
            {renderPoster(props, props.poster)}
            {renderTitle(props.title)}
            {renderType(props.type)}
            {renderYear(props.year)}
            {renderDateAdded(props.dateAdded)}
            <span className={styles['views']}>{props.views}</span>
            <span className={styles['hours']}>{props.hours}</span>
            {renderLastViewed(props.lastViewed)}
            {renderTrailerIcon(props)}
            {renderAddlibIcon(props)}
        </div>
    );
}

LibraryItemList.propTypes = {
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    dateAdded: PropTypes.instanceOf(Date).isRequired,
    views: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    lastViewed: PropTypes.instanceOf(Date).isRequired,
    playButtonClicked: PropTypes.func,
    viewTrailer: PropTypes.func,
    addTolib: PropTypes.func
};
LibraryItemList.defaultProps = {
    poster: '',
    title: '',
    type: '',
    year: '',
    dateAdded: new Date(''), //Invalid Date
    views: 0,
    hours: 0,
    lastViewed: new Date('')
};

export default LibraryItemList;
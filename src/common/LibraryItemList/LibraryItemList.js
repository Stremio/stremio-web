import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class LibraryItemList extends Component {
    renderPoster() {
        if(this.props.poster.length === 0) {
            return null;
        }
        // src?
        return (
            <div className={styles['poster-container']}>
                <img className={styles['poster']} src={this.props.poster}/>
            </div>
        );
    }

    renderPlay() {
        return (
            <div className={styles['play-container']}>
                <Icon className={styles['play']} icon={'ic_play'}/>
            </div>
        );
    }

    renderTitle() {
        if(this.props.title.length === 0) {
            return null;
        }

        return (
            <span className={styles['title']}>{this.props.title}</span>
        );
    }

    renderType() {
        if(this.props.type.length === 0) {
            return null;
        }

        return (
            <span className={styles['type']}>{this.props.type}</span>
        );
    }

    renderYear() {
        if(this.props.year.length === 0) {
            return null;
        }

        return (
            <span className={styles['year']}>{this.props.year}</span>
        );
    }

    renderDateAdded() {
        if(this.props.dateAdded.length === 0) {
            return null;
        }

        return (
            <span className={styles['date-added']}>{this.props.dateAdded}</span>
        );  
    }

    renderViews() {
        return (
            <span className={styles['views']}>{this.props.views}</span>
        );
    }

    renderHours() {
        return (
            <span className={styles['hours']}>{this.props.hours}</span>
        );
    }

    renderLastViewed() {
        if(this.props.lastViewed.length === 0) {
            return null;
        }

        return (
            <span className={styles['last-viewed']}>{this.props.lastViewed}</span>
        );
    }

    renderTrailerIcon() {
        return (
            <div className={styles['icon-container']}>
                <Icon className={styles['trailer-icon']} icon={'ic_movies'}/>
                <div className={styles['trailer']}>Trailer</div>
            </div>
        );
    }

    renderAddlibIcon() {
        return (
            <div className={styles['icon-container']}>
                <Icon className={styles['addlib-icon']} icon={'ic_addlib'}/>
                <div className={styles['addlib']}>Add to Library</div>
            </div>
        );
    }

    render() {
        return (
            <div className={styles['library-item']}>
                {this.renderPoster()}
                {this.renderPlay()}
                {this.renderTitle()}
                {this.renderType()}
                {this.renderYear()}
                {this.renderDateAdded()}
                {this.renderViews()}
                {this.renderHours()}
                {this.renderLastViewed()}
                {this.renderTrailerIcon()}
                {this.renderAddlibIcon()}
            </div>
        );
    }
}

LibraryItemList.propTypes = {
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    dateAdded: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    hours: PropTypes.number.isRequired,
    lastViewed: PropTypes.string.isRequired
};
LibraryItemList.defaultProps = {
    poster: '',
    title: '',
    type: '',
    year: '',
    dateAdded: '',
    views: 0,
    hours: 0,
    lastViewed: ''
};

export default LibraryItemList;
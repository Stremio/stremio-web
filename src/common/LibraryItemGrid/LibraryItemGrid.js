import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class LibraryItemGrid extends Component {
    renderPlay() {
        return (
            <div className={styles['play-container']}>
                <Icon className={styles['play']} icon={'ic_play'}/>
            </div>
        );
    }

    render() {
        return (
            <div className={styles['library-item']} style={{ backgroundImage: 'url('+ this.props.poster +')'}}>
                {this.renderPlay()}
            </div>
        );
    }
}

LibraryItemGrid.propTypes = {
    poster: PropTypes.string.isRequired
};
LibraryItemGrid.defaultProps = {
    poster: ''
};

export default LibraryItemGrid;
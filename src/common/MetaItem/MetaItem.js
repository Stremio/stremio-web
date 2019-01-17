import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class MetaItem extends Component {
    render() {
        return (
            <div className={classnames(styles['meta-item-container'], styles[`relative-size-${this.props.relativeSize}`], styles[`poster-shape-${this.props.posterShape}`], this.props.className)}>
                <div style={{ backgroundImage: `url('${this.props.poster}')` }} className={styles['poster-image']} />
            </div>
        );
    }
}

MetaItem.propTypes = {
    className: PropTypes.string,
    relativeSize: PropTypes.oneOf(['auto', 'height']).isRequired,
    posterShape: PropTypes.oneOf(['poster', 'landscape', 'square']).isRequired,
    poster: PropTypes.string.isRequired,
};
MetaItem.defaultProps = {
    relativeSize: 'auto',
    posterShape: 'square',
    poster: '',
};

export default MetaItem;

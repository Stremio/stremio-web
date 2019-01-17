import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class BufferingLoader extends PureComponent {
    render() {
        if (!this.props.buffering) {
            return null;
        }

        return (
            <div className={classnames(this.props.className, styles['buffering-loader-container'])}>
                <div className={styles['bufferring-loader']} />
            </div>
        );
    }
}

BufferingLoader.propTypes = {
    className: PropTypes.string,
    buffering: PropTypes.bool
};

export default BufferingLoader;

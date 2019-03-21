const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const styles = require('./styles');

class BufferingLoader extends React.PureComponent {
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

module.exports = BufferingLoader;

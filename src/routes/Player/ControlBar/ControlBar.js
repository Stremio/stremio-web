import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class ControlBar extends Component {
    onSeekRequested = (event) => {
        this.props.seek(event.target.value);
    }

    render() {
        return (
            <div className={classnames(this.props.className, styles['root-container'])}>
                <div className={styles['button']} onClick={this.props.paused ? this.props.play : this.props.pause}>
                    <Icon
                        className={styles['icon']}
                        icon={this.props.paused ? 'ic_play' : 'ic_pause'}
                    />
                </div>
                {
                    this.props.time !== null && this.props.duration !== null
                        ?
                        <input
                            className={styles['seek-bar']}
                            type={'range'}
                            step={1000}
                            min={0}
                            max={this.props.duration}
                            value={this.props.time}
                            onChange={this.onSeekRequested}
                        />
                        :
                        null
                }
            </div>
        );
    }
}

ControlBar.propTypes = {
    className: PropTypes.string,
    paused: PropTypes.bool,
    time: PropTypes.number,
    duration: PropTypes.number,
    volume: PropTypes.number,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    seek: PropTypes.func.isRequired
};

export default ControlBar;

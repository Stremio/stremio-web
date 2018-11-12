import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class ControlBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            seekTime: -1
        };
    }

    componentWillUnmount() {
        this.resetSeekTime.cancel();
    }

    resetSeekTime = debounce(() => {
        this.setState({ seekTime: -1 });
    }, 3000)

    calculateSeekTime = (mouseX, seekBarElement) => {
        const { left, width } = seekBarElement.getBoundingClientRect();
        const position = Math.min(Math.max(mouseX - left, 0), width);
        const seekTime = Math.floor((position / width) * this.props.duration);
        return seekTime;
    }

    onStartSliding = ({ currentTarget, clientX, button }) => {
        if (button !== 0) {
            return;
        }

        const mousemove = ({ clientX }) => {
            this.setState({ seekTime: this.calculateSeekTime(clientX, currentTarget) });
        };
        const mouseup = ({ clientX }) => {
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
            document.body.style['pointer-events'] = 'initial';
            document.documentElement.style.cursor = 'initial';
            currentTarget.classList.remove(styles['active']);
            const seekTime = this.calculateSeekTime(clientX, currentTarget);
            this.props.seek(seekTime);
            this.resetSeekTime();
        };

        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
        document.body.style['pointer-events'] = 'none';
        document.documentElement.style.cursor = 'pointer';
        currentTarget.classList.add(styles['active']);
        this.setState({ seekTime: this.calculateSeekTime(clientX, currentTarget) });
        this.resetSeekTime.cancel();
    }

    renderPlayPauseButton() {
        return (
            <div className={styles['button']} onClick={this.props.paused ? this.props.play : this.props.pause}>
                <Icon
                    className={styles['icon']}
                    icon={this.props.paused ? 'ic_play' : 'ic_pause'}
                />
            </div>
        );
    }

    renderSeekBar() {
        if (this.props.time === null || this.props.duration === null) {
            return null;
        }

        const thumbPosition = this.state.seekTime !== -1 ?
            this.state.seekTime / this.props.duration
            :
            this.props.time / this.props.duration;

        return (
            <div className={styles['seek-bar']} onMouseDown={this.onStartSliding}>
                <div className={styles['seek-line']} />
                <div className={styles['thumb-container']} style={{ left: `calc(100% * ${thumbPosition})` }}>
                    <div className={styles['thumb']} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={classnames(this.props.className, styles['root-container'])}>
                {this.renderSeekBar()}
                {this.renderPlayPauseButton()}
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

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

        const releaseThumb = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('blur', onBlur);
            document.body.style['pointer-events'] = 'initial';
            document.documentElement.style.cursor = 'initial';
            currentTarget.classList.remove(styles['active']);
        };
        const onBlur = () => {
            releaseThumb();
            this.resetSeekTime.cancel();
            this.setState({ seekTime: -1 });
        };
        const onMouseMove = ({ clientX }) => {
            this.setState({ seekTime: this.calculateSeekTime(clientX, currentTarget) });
        };
        const onMouseUp = ({ clientX }) => {
            releaseThumb();
            this.resetSeekTime();
            this.props.seek(this.calculateSeekTime(clientX, currentTarget));
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('blur', onBlur);
        document.body.style['pointer-events'] = 'none';
        document.documentElement.style.cursor = 'pointer';
        currentTarget.classList.add(styles['active']);
        this.resetSeekTime.cancel();
        this.setState({ seekTime: this.calculateSeekTime(clientX, currentTarget) });
    }

    formatTime = (time) => {
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
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

    renderTimeLabel() {
        if (this.props.time === null || this.props.duration === null) {
            return null;
        }

        const currentTime = this.state.seekTime !== -1 ?
            this.formatTime(this.state.seekTime)
            :
            this.formatTime(this.props.time);

        return (
            <div className={styles['time-label']}>{currentTime} / {this.formatTime(this.props.duration)}</div>
        );
    }

    render() {
        return (
            <div className={classnames(this.props.className, styles['root-container'])}>
                {this.renderSeekBar()}
                <div className={styles['buttons-bar']}>
                    {this.renderPlayPauseButton()}
                    <div className={styles['separator']} />
                    {this.renderTimeLabel()}
                </div>
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

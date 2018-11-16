import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class Slider extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.orientation !== nextProps.orientation) {
            console.warn(new Error('changing orientation property at runtime is not supported'));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.minValue !== this.props.minValue ||
            nextProps.maxValue !== this.props.maxValue ||
            nextProps.containerClassName !== this.props.containerClassName ||
            nextProps.thumbClassName !== this.props.thumbClassName;
    }

    onSliding = (...args) => {
        if (typeof this.props.onSliding === 'function') {
            this.props.onSliding(...args);
        }
    }

    onSlidingCompleted = (...args) => {
        if (typeof this.props.onSlidingCompleted === 'function') {
            this.props.onSlidingCompleted(...args);
        }
    }

    onSlidingAborted = (...args) => {
        if (typeof this.props.onSlidingAborted === 'function') {
            this.props.onSlidingAborted(...args);
        }
    }

    calculateSlidingValue = ({ mouseX, mouseY, sliderElement }) => {
        const { x: sliderX, y: sliderY, width: sliderWidth, height: sliderHeight } = sliderElement.getBoundingClientRect();
        const sliderStart = this.props.orientation === 'horizontal' ? sliderX : sliderY;
        const sliderLength = this.props.orientation === 'horizontal' ? sliderWidth : sliderHeight;
        const mouseStart = this.props.orientation === 'horizontal' ? mouseX : mouseY;
        const thumbStart = Math.min(Math.max(mouseStart - sliderStart, 0), sliderLength);
        const slidingValueCoef = this.props.orientation === 'horizontal' ? thumbStart / sliderLength : (sliderLength - thumbStart) / sliderLength;
        const slidingValue = slidingValueCoef * (this.props.maxValue - this.props.minValue) + this.props.minValue;
        return Math.floor(slidingValue);
    }

    onStartSliding = ({ currentTarget: sliderElement, clientX: mouseX, clientY: mouseY, button }) => {
        if (button !== 0) {
            return;
        }

        const releaseThumb = () => {
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            document.body.style['pointer-events'] = 'initial';
            document.documentElement.style.cursor = 'initial';
            sliderElement.classList.remove(styles['active']);
        };
        const onBlur = () => {
            releaseThumb();
            this.onSlidingAborted();
        };
        const onMouseUp = ({ clientX: mouseX, clientY: mouseY }) => {
            releaseThumb();
            const slidingValue = this.calculateSlidingValue({ mouseX, mouseY, sliderElement });
            this.onSlidingCompleted(slidingValue);
        };
        const onMouseMove = ({ clientX: mouseX, clientY: mouseY }) => {
            const slidingValue = this.calculateSlidingValue({ mouseX, mouseY, sliderElement });
            this.onSliding(slidingValue);
        };

        window.addEventListener('blur', onBlur);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        document.body.style['pointer-events'] = 'none';
        document.documentElement.style.cursor = 'pointer';
        sliderElement.classList.add(styles['active']);
        onMouseMove({ clientX: mouseX, clientY: mouseY });
    }

    render() {
        const thumbStartProp = this.props.orientation === 'horizontal' ? 'left' : 'bottom';
        const thumbStart = (this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue);
        return (
            <div className={classnames(styles['slider-container'], styles[this.props.orientation], this.props.containerClassName)} onMouseDown={this.onStartSliding}>
                <div className={styles['line']} />
                <div
                    className={classnames(styles['thumb'], this.props.thumbClassName)}
                    style={{ [thumbStartProp]: `calc(100% * ${thumbStart})` }}
                />
            </div>
        );
    }
}

Slider.propTypes = {
    containerClassName: PropTypes.string,
    thumbClassName: PropTypes.string,
    value: PropTypes.number.isRequired,
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    onSliding: PropTypes.func,
    onSlidingCompleted: PropTypes.func,
    onSlidingAborted: PropTypes.func
};
Slider.defaultProps = {
    value: 0,
    minValue: 0,
    maxValue: 100,
    orientation: 'horizontal'
};

export default Slider;

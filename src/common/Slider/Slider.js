import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class Slider extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.orientation !== this.props.orientation) {
            console.warn(new Error('changing orientation property at runtime is not supported'));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.minimumValue !== this.props.minimumValue ||
            nextProps.maximumValue !== this.props.maximumValue ||
            nextProps.containerClassName !== this.props.containerClassName ||
            nextProps.thumbClassName !== this.props.thumbClassName;
    }

    onSlide = (...args) => {
        if (typeof this.props.onSlide === 'function') {
            this.props.onSlide(...args);
        }
    }

    onComplete = (...args) => {
        if (typeof this.props.onComplete === 'function') {
            this.props.onComplete(...args);
        }
    }

    onCancel = (...args) => {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel(...args);
        }
    }

    calculateSlidingValue = ({ mouseX, mouseY, sliderElement }) => {
        const { x: sliderX, y: sliderY, width: sliderWidth, height: sliderHeight } = sliderElement.getBoundingClientRect();
        const sliderStart = this.props.orientation === 'horizontal' ? sliderX : sliderY;
        const sliderLength = this.props.orientation === 'horizontal' ? sliderWidth : sliderHeight;
        const mouseStart = this.props.orientation === 'horizontal' ? mouseX : mouseY;
        const thumbStart = Math.min(Math.max(mouseStart - sliderStart, 0), sliderLength);
        const slidingValueCoef = this.props.orientation === 'horizontal' ? thumbStart / sliderLength : (sliderLength - thumbStart) / sliderLength;
        const slidingValue = slidingValueCoef * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue;
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
            this.onCancel();
        };
        const onMouseUp = ({ clientX: mouseX, clientY: mouseY }) => {
            releaseThumb();
            const slidingValue = this.calculateSlidingValue({ mouseX, mouseY, sliderElement });
            this.onComplete(slidingValue);
        };
        const onMouseMove = ({ clientX: mouseX, clientY: mouseY }) => {
            const slidingValue = this.calculateSlidingValue({ mouseX, mouseY, sliderElement });
            this.onSlide(slidingValue);
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
        const thumbStartProp = this.props.orientation === 'horizontal' ? 'marginLeft' : 'marginBottom';
        const thumbStart = (this.props.value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
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
    minimumValue: PropTypes.number.isRequired,
    maximumValue: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    onSlide: PropTypes.func,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func
};
Slider.defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 100,
    orientation: 'horizontal'
};

export default Slider;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class Slider extends Component {
    constructor(props) {
        super(props);

        this.orientation = props.orientation;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.minimumValue !== this.props.minimumValue ||
            nextProps.maximumValue !== this.props.maximumValue ||
            nextProps.className !== this.props.className;
    }

    onSlide = (value) => {
        this.props.onSlide(value);
    }

    onComplete = (value) => {
        this.props.onComplete(value);
    }

    onCancel = () => {
        this.props.onCancel();
    }

    calculateSlidingValue = ({ mouseX, mouseY, sliderElement }) => {
        const { x: sliderX, y: sliderY, width: sliderWidth, height: sliderHeight } = sliderElement.getBoundingClientRect();
        const sliderStart = this.orientation === 'horizontal' ? sliderX : sliderY;
        const sliderLength = this.orientation === 'horizontal' ? sliderWidth : sliderHeight;
        const mouseStart = this.orientation === 'horizontal' ? mouseX : mouseY;
        const thumbStart = Math.min(Math.max(mouseStart - sliderStart, 0), sliderLength);
        const slidingValueCoef = this.orientation === 'horizontal' ? thumbStart / sliderLength : (sliderLength - thumbStart) / sliderLength;
        const slidingValue = slidingValueCoef * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue;
        return slidingValue;
    }

    onStartSliding = ({ currentTarget: sliderElement, clientX: mouseX, clientY: mouseY, button }) => {
        if (button !== 0) {
            return;
        }

        const releaseThumb = () => {
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            document.documentElement.style.cursor = 'initial';
            document.body.style['pointer-events'] = 'initial';
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
        document.documentElement.style.cursor = 'pointer';
        document.body.style['pointer-events'] = 'none';
        onMouseMove({ clientX: mouseX, clientY: mouseY });
    }

    render() {
        const thumbStartProp = this.orientation === 'horizontal' ? 'left' : 'bottom';
        const thumbStart = Math.min((this.props.value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue), 1);
        return (
            <div className={classnames(styles['slider-container'], styles[this.orientation], this.props.className)} onMouseDown={this.onStartSliding}>
                <div className={styles['track']} />
                <div className={styles['thumb']} style={{ [thumbStartProp]: `calc(100% * ${thumbStart})` }} />
            </div>
        );
    }
}

Slider.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    minimumValue: PropTypes.number.isRequired,
    maximumValue: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    onSlide: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
Slider.defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 100,
    orientation: 'horizontal'
};

export default Slider;

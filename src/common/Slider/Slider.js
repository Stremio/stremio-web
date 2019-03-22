import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class Slider extends Component {
    constructor(props) {
        super(props);

        this.sliderContainerRef = React.createRef();
        this.orientation = props.orientation;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.minimumValue !== this.props.minimumValue ||
            nextProps.maximumValue !== this.props.maximumValue ||
            nextProps.className !== this.props.className;
    }

    componentWillUnmount() {
        this.releaseThumb();
    }

    calculateSlidingValue = ({ mouseX, mouseY }) => {
        const { x: sliderX, y: sliderY, width: sliderWidth, height: sliderHeight } = this.sliderContainerRef.current.getBoundingClientRect();
        const sliderStart = this.orientation === 'horizontal' ? sliderX : sliderY;
        const sliderLength = this.orientation === 'horizontal' ? sliderWidth : sliderHeight;
        const mouseStart = this.orientation === 'horizontal' ? mouseX : mouseY;
        const thumbStart = Math.min(Math.max(mouseStart - sliderStart, 0), sliderLength);
        const slidingValueCoef = this.orientation === 'horizontal' ? thumbStart / sliderLength : (sliderLength - thumbStart) / sliderLength;
        const slidingValue = slidingValueCoef * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue;
        return slidingValue;
    }

    releaseThumb = () => {
        window.removeEventListener('blur', this.onBlur);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        document.documentElement.style.cursor = 'initial';
        document.body.style['pointer-events'] = 'initial';
    }

    onBlur = () => {
        this.releaseThumb();
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }
    }

    onMouseUp = ({ clientX: mouseX, clientY: mouseY }) => {
        this.releaseThumb();
        const slidingValue = this.calculateSlidingValue({ mouseX, mouseY });
        if (typeof this.props.onComplete === 'function') {
            this.props.onComplete(slidingValue);
        }
    }

    onMouseMove = ({ clientX: mouseX, clientY: mouseY }) => {
        const slidingValue = this.calculateSlidingValue({ mouseX, mouseY });
        if (typeof this.props.onSlide === 'function') {
            this.props.onSlide(slidingValue);
        }
    }

    onStartSliding = ({ clientX: mouseX, clientY: mouseY, button }) => {
        if (button !== 0) {
            return;
        }

        window.addEventListener('blur', this.onBlur);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        document.documentElement.style.cursor = 'pointer';
        document.body.style['pointer-events'] = 'none';
        this.onMouseMove({ clientX: mouseX, clientY: mouseY });
    }

    render() {
        const thumbStartProp = this.orientation === 'horizontal' ? 'left' : 'bottom';
        const trackBeforeSizeProp = this.orientation === 'horizontal' ? 'width' : 'height';
        const thumbStart = Math.max(0, Math.min(1, (this.props.value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue)));
        return (
            <div ref={this.sliderContainerRef} className={classnames(styles['slider-container'], styles[this.orientation], { 'disabled': this.props.minimumValue === this.props.maximumValue }, this.props.className)} onMouseDown={this.onStartSliding}>
                <div className={styles['track']} />
                <div className={styles['track-before']} style={{ [trackBeforeSizeProp]: `calc(100% * ${thumbStart})` }} />
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

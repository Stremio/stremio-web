import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles';

class Slider extends Component {
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

    calculateSlidingValue = (mouseX, sliderElement) => {
        const { x: sliderX, width: sliderWidth } = sliderElement.getBoundingClientRect();
        const thumbX = Math.min(Math.max(mouseX - sliderX, 0), sliderWidth);
        const slidingValue = (thumbX / sliderWidth) * (this.props.maxValue - this.props.minValue) + this.props.minValue;
        return Math.floor(slidingValue);
    }

    onStartSliding = ({ currentTarget: sliderElement, clientX: mouseX, button }) => {
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
        const onMouseUp = ({ clientX: mouseX }) => {
            releaseThumb();
            this.onSlidingCompleted(this.calculateSlidingValue(mouseX, sliderElement));
        };
        const onMouseMove = ({ clientX: mouseX }) => {
            this.onSliding(this.calculateSlidingValue(mouseX, sliderElement));
        };

        window.addEventListener('blur', onBlur);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        document.body.style['pointer-events'] = 'none';
        document.documentElement.style.cursor = 'pointer';
        sliderElement.classList.add(styles['active']);
        onMouseMove({ clientX: mouseX });
    }

    render() {
        const thumbLeft = (this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue);
        return (
            <div className={classnames(styles['slider-container'], this.props.containerClassName)} onMouseDown={this.onStartSliding}>
                <div className={styles['line']} />
                <div
                    className={classnames(styles['thumb'], this.props.thumbClassName)}
                    style={{ left: `calc(100% * ${thumbLeft})` }}
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
    onSliding: PropTypes.func,
    onSlidingCompleted: PropTypes.func,
    onSlidingAborted: PropTypes.func
};
Slider.defaultProps = {
    value: 0,
    minValue: 0,
    maxValue: 100
};

export default Slider;

// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useEffect, useState } = require('react');
const classnames = require('classnames');
const styles = require('./ClockOverlay.less');

// format: 'auto' | '12h' | '24h'
// position: 'top-left' | 'top-center' | 'top-right'

function formatTime(format) {
    const options = { hour: 'numeric', minute: '2-digit' };
    if (format === '12h') options.hour12 = true;
    if (format === '24h') options.hour12 = false;
    // 'auto' → omit hour12, Intl uses locale default
    return new Intl.DateTimeFormat(navigator.language, options).format(new Date());
}

const ClockOverlay = ({ className, format, position }) => {
    const [time, setTime] = useState(() => formatTime(format));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatTime(format));
        }, 1000);
        return () => clearInterval(interval);
    }, [format]);

    return (
        <div className={classnames(className, styles['clock-overlay-layer'], styles[position])}>
            <span>{time}</span>
        </div>
    );
};

module.exports = ClockOverlay;

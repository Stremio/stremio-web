// Copyright (C) 2017-2023 Smart code 203358507

const { useState } = require('react');

const useOsdClockSettings = () => {
    const [enabled, setEnabledState] = useState(() => {
        return localStorage.getItem('osd_clock_enabled') === 'true';
    });

    const [format, setFormatState] = useState(() => {
        return localStorage.getItem('osd_clock_format') || 'auto';
    });

    const [position, setPositionState] = useState(() => {
        return localStorage.getItem('osd_clock_position') || 'top-right';
    });

    const setEnabled = (bool) => {
        localStorage.setItem('osd_clock_enabled', String(bool));
        setEnabledState(bool);
    };

    const setFormat = (str) => {
        localStorage.setItem('osd_clock_format', str);
        setFormatState(str);
    };

    const setPosition = (str) => {
        localStorage.setItem('osd_clock_position', str);
        setPositionState(str);
    };

    return { enabled, format, position, setEnabled, setFormat, setPosition };
};

module.exports = useOsdClockSettings;

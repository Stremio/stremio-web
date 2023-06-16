// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');

const DelayedRenderer = ({ children, delay }) => {
    const [render, setRender] = React.useState(false);
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRender(true);
        }, delay);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return render ? children : null;
};

DelayedRenderer.propTypes = {
    children: PropTypes.node
};

module.exports = DelayedRenderer;

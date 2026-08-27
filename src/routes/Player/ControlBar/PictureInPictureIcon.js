// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');

const PictureInPictureIcon = ({ className, active }) => (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
        <path
            d="M88 96c0-17.7 14.3-32 32-32h224c17.7 0 32 14.3 32 32v160H88V96Z"
            style={{ stroke: 'currentcolor', strokeLinejoin: 'round', strokeWidth: 32, fill: 'none' }}
        />
        <path
            d="M280 272h112c17.7 0 32 14.3 32 32v80c0 17.7-14.3 32-32 32H280c-17.7 0-32-14.3-32-32v-80c0-17.7 14.3-32 32-32Z"
            style={{ fill: 'currentcolor' }}
        />
        <path
            d={active ? 'm224 224-96-96m0 0v64m0-64h64' : 'm128 128 96 96m0 0v-64m0 64h-64'}
            style={{ stroke: 'currentcolor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 32, fill: 'none' }}
        />
    </svg>
);

PictureInPictureIcon.defaultProps = {
    className: undefined,
    active: false
};

PictureInPictureIcon.propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool
};

module.exports = PictureInPictureIcon;

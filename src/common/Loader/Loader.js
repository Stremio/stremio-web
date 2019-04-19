const React = require('react');
const PropTypes = require('prop-types');
const colors = require('stremio-colors');

// TODO: implement it with polygon and clip-path
const Loader = ({ fill, children, ...props }) => (
    <svg {...props} viewBox={'0 0 1024 1024'}>
        <path d={'M512 0l-512 512 512 512 512-512zM411.106 752.941v-480.376l323.464 240.941z'} fill={fill} />
        <path d={'M256,256 512,0 768,256 512,512Z'} fillOpacity={0.8}>
            <animate
                attributeType={'CSS'}
                attributeName={'opacity'}
                dur={'3s'}
                values={'0.8;0.3;0.3;0.3;0.3;0.3'}
                keyTimes={'0;0.2;0.4;0.6;0.8;1'}
                calcMode={'discrete'}
                repeatCount={'indefinite'}
            />
        </path>
        <path d={'M768,256 1024,512 768,768 512,512Z'} fillOpacity={0.8}>
            <animate
                attributeType={'CSS'}
                attributeName={'opacity'}
                dur={'3s'}
                values={'0.8;0.8;0.3;0.3;0.3;0.3'}
                keyTimes={'0;0.2;0.4;0.6;0.8;1'}
                calcMode={'discrete'}
                repeatCount={'indefinite'}
            />
        </path>
        <path d={'M768,768 512,1024 256,768 512,512Z'} fillOpacity={0.8}>
            <animate
                attributeType={'CSS'}
                attributeName={'opacity'}
                dur={'3s'}
                values={'0.8;0.8;0.8;0.3;0.3;0.3'}
                keyTimes={'0;0.2;0.4;0.6;0.8;1'}
                calcMode={'discrete'}
                repeatCount={'indefinite'}
            />
        </path>
        <path d={'M256,768 0,512 256,256 512,512Z'} fillOpacity={0.8}>
            <animate
                attributeType={'CSS'}
                attributeName={'opacity'}
                dur={'3s'}
                values={'0.8;0.8;0.8;0.8;0.3;0.3'}
                keyTimes={'0;0.2;0.4;0.6;0.8;1'}
                calcMode={'discrete'}
                repeatCount={'indefinite'}
            />
        </path>
    </svg>
);

Loader.propTypes = {
    fill: PropTypes.string.isRequired
};

Loader.defaultProps = {
    fill: colors.surfacelighter80
};

module.exports = Loader;

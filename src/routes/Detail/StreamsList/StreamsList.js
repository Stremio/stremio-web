const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Stream = require('./Stream');
const useStreams = require('./useStreams');
require('./styles');

const StreamsList = ({ className, metaItem }) => {
    const streams = useStreams(metaItem);
    return (
        <div className={classnames(className, 'streams-list-container')}>
            {streams.map((stream) => (
                <Stream
                    {...stream}
                    key={stream.id}
                    className={'stream'}
                />
            ))}
        </div>
    );
}

StreamsList.propTypes = {
    className: PropTypes.string,
    metaItem: PropTypes.object
};

module.exports = StreamsList;

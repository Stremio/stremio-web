const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const Stream = require('./Stream');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const StreamsList = ({ className, streams }) => {
    const readyStreams = streams
        .filter(stream => stream.content.type === 'Ready')
        .map(stream => stream.content.content)
        .flat();
    return (
        <div className={classnames(className, styles['streams-list-container'])}>
            <div className={styles['streams-scroll-container']}>
                {
                    streams.length === 0 || streams.every(stream => stream.content.type === 'Loading') ?
                        <React.Fragment>
                            <StreamPlaceholder className={styles['stream']} />
                            <StreamPlaceholder className={styles['stream']} />
                            <StreamPlaceholder className={styles['stream']} />
                            <StreamPlaceholder className={styles['stream']} />
                            <StreamPlaceholder className={styles['stream']} />
                            <StreamPlaceholder className={styles['stream']} />
                        </React.Fragment>
                        :
                        readyStreams.length === 0 ?
                            <div className={styles['no-streams-label']}>No streams were found</div>
                            :
                            readyStreams.map((stream) => (
                                <Stream {...stream} key={stream.id} className={styles['stream']} />
                            ))
                }
            </div>
            <Button className={styles['install-addons-container']} title={'Install addons'} href={'#/addons'}>
                <Icon className={styles['icon']} icon={'ic_addons'} />
                <div className={styles['label']}>Install addons</div>
            </Button>
        </div>
    );
}

StreamsList.propTypes = {
    className: PropTypes.string,
    streams: PropTypes.arrayOf(PropTypes.object)
};

module.exports = StreamsList;

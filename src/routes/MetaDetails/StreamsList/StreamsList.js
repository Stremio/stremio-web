const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const Stream = require('./Stream');
const StreamPlaceholder = require('./StreamPlaceholder');
const styles = require('./styles');

const StreamsList = ({ className, streamsGroups }) => {
    const readyStreams = React.useMemo(() => {
        return streamsGroups
            .filter((stream) => stream.content.type === 'Ready')
            .map((stream) => stream.content.content)
            .flat(1);
    }, [streamsGroups]);
    return (
        <div className={classnames(className, styles['streams-list-container'])}>
            <div className={styles['streams-scroll-container']}>
                {
                    readyStreams.length > 0 ?
                        readyStreams.map((stream, index) => (
                            <Stream {...stream} key={index} className={styles['stream']} />
                        ))
                        :
                        streamsGroups.length === 0 ?
                            <div className={styles['message-label']}>No addons ware requested for streams</div>
                            :
                            streamsGroups.every((group) => group.content.type === 'Err') ?
                                <div className={styles['message-label']}>No streams were found</div>
                                :
                                <React.Fragment>
                                    <StreamPlaceholder className={styles['stream']} />
                                    <StreamPlaceholder className={styles['stream']} />
                                </React.Fragment>
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
    streamsGroups: PropTypes.arrayOf(PropTypes.object)
};

module.exports = StreamsList;

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button } = require('stremio/common');
const Stream = require('./Stream');
const styles = require('./styles');

const StreamsList = ({ className, streamsResources }) => {
    const streams = React.useMemo(() => {
        return streamsResources
            .filter((streamsResource) => streamsResource.content.type === 'Ready')
            .map((streamsResource) => streamsResource.content.content)
            .flat(1);
    }, [streamsResources]);
    return (
        <div className={classnames(className, styles['streams-list-container'])}>
            <div className={styles['streams-scroll-container']}>
                {
                    streamsResources.length === 0 ?
                        <div className={styles['message-label']}>No addons ware requested for streams</div>
                        :
                        streamsResources.every((streamsResource) => streamsResource.content.type === 'Err') ?
                            <div className={styles['message-label']}>No streams were found</div>
                            :
                            streams.length > 0 ?
                                streams.map((stream, index) => (
                                    <Stream
                                        {...stream}
                                        key={index}
                                        className={styles['stream']}
                                    />
                                ))
                                :
                                <React.Fragment>
                                    <Stream.Placeholder className={styles['stream']} />
                                    <Stream.Placeholder className={styles['stream']} />
                                </React.Fragment>
                }
            </div>
            <Button className={styles['install-addons-container']} title={'Install addons'} href={'#/addons'}>
                <Icon className={styles['icon']} icon={'ic_addons'} />
                <div className={styles['label']}>Install addons</div>
            </Button>
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streamsResources: PropTypes.arrayOf(PropTypes.object)
};

module.exports = StreamsList;

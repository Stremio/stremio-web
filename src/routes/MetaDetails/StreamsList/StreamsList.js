const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Image } = require('stremio/common');
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
        <div className={classnames(className, styles['streams-list-container'], { 'streams-list-message': streamsResources.length === 0 || streamsResources.every((streamsResource) => streamsResource.content.type === 'Err') })}>
            <div className={styles['streams-scroll-container']}>
                {
                    streamsResources.length === 0 ?
                        <div className={styles['message-container']}>
                            <Image className={styles['image']} src={'/images/empty.png'} />
                            <div className={styles['label']}>No addons were requested for streams</div>
                        </div>
                        :
                        streamsResources.every((streamsResource) => streamsResource.content.type === 'Err') ?
                            <div className={styles['message-container']}>
                                <Image className={styles['image']} src={'/images/empty.png'} />
                                <div className={styles['label']}>No streams were found!</div>
                                <div className={styles['description']}>Please install some addons to find more streams</div>
                            </div>
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
            <Button className={styles['install-button-container']} title={'Install Addons'} href={'#/addons'}>
                <Icon className={styles['icon']} icon={'ic_addons'} />
                <div className={styles['label']}>Install Addons</div>
            </Button>
        </div>
    );
};

StreamsList.propTypes = {
    className: PropTypes.string,
    streamsResources: PropTypes.arrayOf(PropTypes.object)
};

module.exports = StreamsList;

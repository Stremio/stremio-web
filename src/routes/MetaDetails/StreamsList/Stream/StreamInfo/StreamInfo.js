// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { default: Icon } = require('@stremio/stremio-icons/react');
const styles = require('./styles');

const StreamInfo = ({ streamSize, streamProvider, streamName, streamFlags, streamSeeders }) => {
    return (
        <div className={styles['info-container']}>
            <div className={styles['stream-name']}>{streamName}</div>
            <div className={styles['description-container']}>
                <div className={styles['stream-properties']}>
                    {
                        typeof streamSeeders === 'number' && streamSeeders > 0 ?
                            <div className={styles['property-container']}>
                                <Icon className={styles['icon']} name={'person'} />
                                <div className={styles['property']}>{streamSeeders}</div>
                            </div>
                            :
                            null
                    }
                    {
                        typeof streamSize === 'string' && streamSize.length > 0 ?
                            <div className={styles['property-container']}>
                                <Icon className={styles['icon']} name={'memory'} />
                                <div className={styles['property']}>{streamSize}</div>
                            </div>
                            :
                            null
                    }
                    {
                        typeof streamProvider === 'string' && streamProvider.length > 0 ?
                            <div className={styles['property-container']}>
                                <Icon className={styles['icon']} name={'settings-outline'} />
                                <div className={styles['property overflow']}>{streamProvider}</div>
                            </div>
                            :
                            null
                    }
                    {
                        typeof streamFlags === 'string' && streamFlags.length > 0 ?
                            <div className={styles['property-container']}>
                                <div className={styles['property']}>{streamFlags}</div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );
};

StreamInfo.propTypes = {
    streamFlags: PropTypes.string,
    streamSize: PropTypes.string,
    streamProvider: PropTypes.string,
    streamSeeders: PropTypes.number,
    streamName: PropTypes.string
};
module.exports = StreamInfo;


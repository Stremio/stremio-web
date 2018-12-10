import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import Stream from './Stream';
import styles from './styles';

const StreamsList = (props) => {
    return (
        <div className={styles['streams-list-container']}>
            <div className={styles['scroll-container']}>
                <div className={styles['streams-list']}>
                    {props.streams
                        .map((stream) =>
                            <Stream key={stream.id}
                                className={styles['stream']}
                                logo={stream.logo}
                                sourceName={stream.sourceName}
                                title={stream.title}
                                subtitle={stream.subtitle}
                                progress={stream.progress}
                            />
                        )}
                </div>
                <div className={styles['button']} onClick={props.onMoreAddonsClicked}>
                    <Icon className={styles['button-icon']} icon={'ic_addons'} /> More Add-ons
                </div>
            </div>
        </div>
    );
}

StreamsList.propTypes = {
    streams: PropTypes.arrayOf(PropTypes.object).isRequired,
    onMoreAddonsClicked: PropTypes.func
};
StreamsList.defaultProps = {
    streams: []
};

export default StreamsList;

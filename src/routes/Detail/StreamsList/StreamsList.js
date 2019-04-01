import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'stremio-icons/dom';
import Stream from './Stream';
import styles from './styles';

const renderStreamPlaceholders = () => {
    const streamPlaceholders = [];
    for (let placeholderNumber = 0; placeholderNumber < 20; placeholderNumber++) {
        streamPlaceholders.push(
            <div key={placeholderNumber} className={styles['placeholder']}>
                <div className={styles['logo-placeholder']}></div>
                <div className={styles['text-placeholder']}></div>
                <div className={styles['button-placeholder']}></div>
            </div>
        )
    }

    return streamPlaceholders;
}

const StreamsList = (props) => {
    return (
        <div className={styles['streams-list-container']}>
            <div className={styles['scroll-container']}>
                {props.streams.length === 0 ?
                    renderStreamPlaceholders()
                    :
                    props.streams.map((stream) =>
                        <Stream key={stream.id}
                            className={styles['stream']}
                            logo={stream.logo}
                            sourceName={stream.sourceName}
                            title={stream.title}
                            subtitle={stream.subtitle}
                            progress={stream.progress}
                        />
                    )}
                <div className={styles['button']} onClick={props.onMoreAddonsClicked}>
                    <Icon className={styles['button-icon']} icon={'ic_addons'} />
                    <div className={styles['button-label']}>More Add-ons</div>
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

// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const styles = require('./styles.less');

const StatisticsMenu = ({ className, stream, statistics }) => {
    const peers = React.useMemo(() => {
        return statistics.type === 'Ready' && statistics.content?.peers ?
            statistics.content.peers
            :
            0;
    }, [statistics]);

    const speed = React.useMemo(() => {
        return statistics.type === 'Ready' && statistics.content?.downloadSpeed ?
            (statistics.content.downloadSpeed / 1000 / 1000).toFixed(2)
            :
            0;
    }, [statistics]);

    const completed = React.useMemo(() => {
        return statistics.type === 'Ready' && statistics.content?.streamProgress ?
            (statistics.content.streamProgress * 100).toFixed(2)
            :
            0;
    }, [statistics]);

    return (
        <div className={classNames(className, styles['statistics-menu-container'])}>
            <div className={styles['title']}>
                Statistics
            </div>
            <div className={styles['stats']}>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        Peers
                    </div>
                    <div className={styles['value']}>
                        { peers }
                    </div>
                </div>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        Speed
                    </div>
                    <div className={styles['value']}>
                        { speed } MB/s
                    </div>
                </div>
                <div className={styles['stat']}>
                    <div className={styles['label']}>
                        Completed
                    </div>
                    <div className={styles['value']}>
                        { completed } %
                    </div>
                </div>
            </div>
            <div className={styles['info-hash']}>
                <div className={styles['label']}>
                    Info Hash
                </div>
                <div className={styles['value']}>
                    { stream.infoHash }
                </div>
            </div>
        </div>
    );
};

StatisticsMenu.propTypes = {
    className: PropTypes.string,
    stream: PropTypes.object,
    statistics: PropTypes.object,
};

module.exports = StatisticsMenu;

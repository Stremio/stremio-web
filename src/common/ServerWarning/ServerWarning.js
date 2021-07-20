// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
// const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const ServerWarning = ({ className }) => {
    // const { core } = useServices();
    const RewindServerWarning = React.useCallback(() => {
        console.log('later');
        // core.transport.dispatch({
        //     action: 'Ctx',
        //     args: {
        //         action: 'RewindServerWarning',
        //     }
        // });
    }, []);
    const DismissServerWarning = React.useCallback(() => {
        console.log('dismiss');
        // core.transport.dispatch({
        //     action: 'Ctx',
        //     args: {
        //         action: 'DismissServerWarning',
        //     }
        // });
    }, []);
    return (
        <div className={classnames(className, styles['warning-container'])}>
            <div className={styles['warning-statement']}>Streaming server must be available.</div>
            <Button className={styles['warning-button']} title={'later'} onClick={RewindServerWarning}>
                <span className={styles['warning-label']}>Later</span>
            </Button>
            <Button className={styles['warning-button']} title={'dismiss'} onClick={DismissServerWarning}>
                <span className={styles['warning-label']}>Dismiss</span>
            </Button>
        </div>
    );
};

ServerWarning.propTypes = {
    className: PropTypes.string
};

module.exports = ServerWarning;

// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const { useServices } = require('stremio/services');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const useProfile = require('stremio/common/useProfile');
const { withCoreSuspender } = require('stremio/common/useModelState');
const styles = require('./styles');

const StreamingServerWarning = ({ className }) => {
    const { core } = useServices();
    const profile = useProfile();
    const onLaterClick = React.useCallback(() => {
        const streamingServerWarningDismissed = new Date();
        streamingServerWarningDismissed.setMonth(streamingServerWarningDismissed.getMonth() + 1);
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    streamingServerWarningDismissed
                }
            }
        });
    }, [profile.settings]);
    const onDismissClick = React.useCallback(() => {
        const streamingServerWarningDismissed = new Date();
        streamingServerWarningDismissed.setFullYear(streamingServerWarningDismissed.getFullYear() + 50);
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'UpdateSettings',
                args: {
                    ...profile.settings,
                    streamingServerWarningDismissed
                }
            }
        });
    }, [profile.settings]);

    if (!isNaN(profile.settings.streamingServerWarningDismissed.getTime()) &&
        profile.settings.streamingServerWarningDismissed.getTime() > Date.now()) {
        return null;
    }

    return (
        <div className={classnames(className, styles['warning-container'])}>
            <div className={styles['warning-statement']}>Streaming server is not available.</div>
            <Button className={styles['warning-button']} title={'Later'} onClick={onLaterClick} tabIndex={-1}>
                <div className={styles['warning-label']}>Later</div>
            </Button>
            <Button className={styles['warning-button']} title={'Dismiss'} onClick={onDismissClick} tabIndex={-1}>
                <div className={styles['warning-label']}>Dismiss</div>
            </Button>
        </div>
    );
};

StreamingServerWarning.propTypes = {
    className: PropTypes.string
};

module.exports = withCoreSuspender(StreamingServerWarning);

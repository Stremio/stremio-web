// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const { useTranslation } = require('react-i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { BottomSheet, Button } = require('stremio/components');
const { CONSTANTS } = require('stremio/common');
const styles = require('./styles');

const MobilePlayerPicker = ({ show, streamingUrl, onClose, onSelectPlayer }) => {
    const { t } = useTranslation();
    const hasStreaming = typeof streamingUrl === 'string' && streamingUrl.length > 0;

    const onPlayerClick = React.useCallback((player) => {
        if (player.requiresStreaming && !hasStreaming) {
            return;
        }
        onSelectPlayer(player.id);
    }, [hasStreaming, onSelectPlayer]);

    return (
        <BottomSheet
            title={t('MOBILE_PLAYER_PICKER_TITLE', { defaultValue: 'Play with' })}
            show={show}
            onClose={onClose}
        >
            <div className={styles['picker-content']}>
                {
                    !hasStreaming ?
                        <div className={styles['hint']}>
                            {t('MOBILE_PLAYER_HTTP_ONLY_HINT', { defaultValue: 'External players need an HTTP stream (e.g. Real-Debrid). Torrent-only sources may not work.' })}
                        </div>
                        :
                        null
                }
                <div className={styles['players-grid']}>
                    {CONSTANTS.IOS_MOBILE_PICKER_PLAYERS.map((player) => {
                        const disabled = player.requiresStreaming && !hasStreaming;
                        const label = t(player.label, { defaultValue: player.label, keySeparator: false });
                        return (
                            <Button
                                key={player.id}
                                className={styles['player-option']}
                                title={label}
                                disabled={disabled}
                                onClick={() => onPlayerClick(player)}
                            >
                                <div className={styles['player-icon-wrap']}>
                                    <Icon className={styles['player-icon']} name={player.icon} />
                                </div>
                                <div className={styles['player-label']}>{label}</div>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </BottomSheet>
    );
};

MobilePlayerPicker.propTypes = {
    show: PropTypes.bool,
    streamingUrl: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSelectPlayer: PropTypes.func.isRequired,
};

module.exports = MobilePlayerPicker;

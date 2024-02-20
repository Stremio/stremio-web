// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { useTranslation } = require('react-i18next');
const { Menu } = require('stremio/common');
const Option = require('./Option');
const styles = require('./styles');

const RATES = Array.from(Array(8).keys(), (n) => n * 0.25 + 0.25).reverse();

const SpeedMenu = ({ className, playbackSpeed, onChange }) => {
    const { t } = useTranslation();

    const onOptionSelect = React.useCallback((value) => {
        if (typeof onChange === 'function') {
            onChange(value);
        }
    }, [onChange]);

    return (
        <Menu className={classnames(className, styles['speed-menu-container'])} shortcut={'KeyR'} align={'right'}>
            <div className={styles['title']}>
                { t('PLAYBACK_SPEED') }
            </div>
            <div className={styles['options-container']}>
                {
                    RATES.map((rate) => (
                        <Option
                            className={styles['option']}
                            key={rate}
                            value={rate}
                            selected={rate === playbackSpeed}
                            onSelect={onOptionSelect}
                        />
                    ))
                }
            </div>
        </Menu>
    );
};

SpeedMenu.propTypes = {
    className: PropTypes.string,
    playbackSpeed: PropTypes.number,
    onChange: PropTypes.func,
};

module.exports = SpeedMenu;

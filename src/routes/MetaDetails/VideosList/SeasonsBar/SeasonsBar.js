// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { t } = require('i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Multiselect } = require('stremio/common');
const SeasonsBarPlaceholder = require('./SeasonsBarPlaceholder');
const styles = require('./styles');

const SeasonsBar = ({ className, seasons, season, onSelect }) => {
    const options = React.useMemo(() => {
        return seasons.map((season) => ({
            value: String(season),
            label: season > 0 ? `${t('SEASON')} ${season}` : t('SPECIAL')
        }));
    }, [seasons]);
    const selected = React.useMemo(() => {
        return [String(season)];
    }, [season]);
    const prevNextButtonOnClick = React.useCallback((event) => {
        if (typeof onSelect === 'function') {
            const seasonIndex = seasons.indexOf(season);
            const valueIndex = event.currentTarget.dataset.action === 'next' ?
                seasonIndex + 1 < seasons.length ? seasonIndex + 1 : seasons.length - 1
                :
                seasonIndex - 1 >= 0 ? seasonIndex - 1 : 0;
            const value = seasons[valueIndex];
            onSelect({
                type: 'select',
                value: value,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [season, seasons, onSelect]);
    const seasonOnSelect = React.useCallback((event) => {
        const value = parseFloat(event.value);
        if (typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                value: value,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onSelect]);
    return (
        <div className={classnames(className, styles['seasons-bar-container'])}>
            <Button className={styles['prev-season-button']} title={'Previous season'} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>Prev</div>
            </Button>
            <Multiselect
                className={styles['seasons-popup-label-container']}
                title={season > 0 ? `${t('SEASON')} ${season}` : t('SPECIAL')}
                direction={'bottom-left'}
                options={options}
                selected={selected}
                onSelect={seasonOnSelect}
            />
            <Button className={styles['next-season-button']} title={'Next season'} data-action={'next'} onClick={prevNextButtonOnClick}>
                <div className={styles['label']}>Next</div>
                <Icon className={styles['icon']} name={'chevron-forward'} />
            </Button>
        </div>
    );
};

SeasonsBar.Placeholder = SeasonsBarPlaceholder;

SeasonsBar.propTypes = {
    className: PropTypes.string,
    seasons: PropTypes.arrayOf(PropTypes.number).isRequired,
    season: PropTypes.number.isRequired,
    onSelect: PropTypes.func
};

module.exports = SeasonsBar;

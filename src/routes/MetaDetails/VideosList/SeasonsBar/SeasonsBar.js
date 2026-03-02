// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { t } = require('i18next');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, MultiselectMenu } = require('stremio/components');
const SeasonsBarPlaceholder = require('./SeasonsBarPlaceholder');
const styles = require('./styles');

const SeasonsBar = ({ className, seasons, season, onSelect }) => {
    const options = React.useMemo(() => {
        return seasons.map((season) => ({
            value: String(season),
            label: season > 0 ? t('SEASON_NUMBER', { season }) : t('SPECIAL')
        }));
    }, [seasons]);
    const selectedSeason = React.useMemo(() => {
        return String(season);
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
    const seasonOnSelect = React.useCallback((value) => {
        if (typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                value: value,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onSelect]);

    const [prevDisabled, nextDisabled] = React.useMemo(() => {
        const currentIndex = seasons.indexOf(season);
        return [
            currentIndex === 0,
            currentIndex === seasons.length - 1
        ];
    }, [season, seasons]);

    return (
        <div className={classnames(className, styles['seasons-bar-container'])}>
            <Button className={classnames(styles['prev-season-button'], { 'disabled': prevDisabled })} title={t('PREV_SEASON')} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} name={'chevron-back'} />
                <div className={styles['label']}>{t('BUTTON_PREV')}</div>
            </Button>
            <MultiselectMenu
                className={styles['seasons-popup-label-container']}
                options={options}
                title={season > 0 ? t('SEASON_NUMBER', { season }) : t('SPECIAL')}
                value={selectedSeason}
                onSelect={seasonOnSelect}
            />
            <Button className={classnames(styles['next-season-button'], { 'disabled': nextDisabled })} title={t('NEXT_SEASON')} data-action={'next'} onClick={prevNextButtonOnClick}>
                <div className={styles['label']}>{t('BUTTON_NEXT')}</div>
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

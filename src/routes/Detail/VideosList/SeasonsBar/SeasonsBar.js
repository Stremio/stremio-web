const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Multiselect } = require('stremio/common');
const styles = require('./styles');

const SeasonsBar = ({ className, season, seasons, onSelect }) => {
    const options = React.useMemo(() => {
        return Array.isArray(seasons) ?
            seasons.map((season) => ({
                value: String(season),
                label: `Season ${season}`
            }))
            :
            [];
    }, [seasons]);
    const selected = React.useMemo(() => {
        return [String(season)];
    }, [season]);
    const renderMultiselectLabelText = React.useMemo(() => {
        return () => `Season ${season}`;
    }, [season]);
    const prevNextButtonOnClick = React.useCallback((event) => {
        if (Array.isArray(seasons) && typeof onSelect === 'function') {
            const seasonIndex = seasons.indexOf(season);
            const valueIndex = event.currentTarget.dataset.action === 'next' ?
                seasonIndex + 1
                :
                seasonIndex - 1;
            const value = valueIndex >= 0 && valueIndex < seasons.length ?
                seasons[valueIndex]
                :
                seasons[0];
            onSelect({
                type: 'select',
                value: value,
                reactEvent: event,
                nativeEvent: event.nativeEvent
            });
        }
    }, [season, seasons, onSelect]);
    const seasonOnSelect = React.useCallback((event) => {
        const value = parseInt(event.value);
        if (!isNaN(value) && typeof onSelect === 'function') {
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
            <Button className={styles['prev-season-button']} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_arrow_left'} />
            </Button>
            <Multiselect
                className={styles['seasons-popup-label-container']}
                direction={'bottom'}
                title={season !== null && !isNaN(season) ? `Season ${season}` : 'Season'}
                options={options}
                selected={selected}
                disabled={false}
                renderLabelText={renderMultiselectLabelText}
                onSelect={seasonOnSelect}
            />
            <Button className={styles['next-season-button']} data-action={'next'} onClick={prevNextButtonOnClick}>
                <Icon className={styseasonles['icon']} icon={'ic_arrow_right'} />
            </Button>
        </div>
    );
};

SeasonsBar.propTypes = {
    className: PropTypes.string,
    selected: PropTypes.number,
    seasons: PropTypes.arrayOf(PropTypes.number),
    onSelect: PropTypes.func
};

module.exports = SeasonsBar;

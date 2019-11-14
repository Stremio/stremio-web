const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Multiselect } = require('stremio/common');
const styles = require('./styles');

const SeasonsBar = ({ className, seasons, season, onSelect }) => {
    const options = React.useMemo(() => {
        return seasons.map((season) => ({
            value: String(season),
            label: `Season ${season}`
        }));
    }, [seasons]);
    const selected = React.useMemo(() => {
        return [String(season)];
    }, [season]);
    const renderMultiselectLabelContent = React.useMemo(() => {
        return () => (
            <div className={styles['season-label']}>Season {season}</div>
        );
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
            <Button className={styles['prev-season-button']} data-action={'prev'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_arrow_left'} />
            </Button>
            <Multiselect
                className={styles['seasons-popup-label-container']}
                direction={'bottom'}
                title={`Season ${season}`}
                options={options}
                selected={selected}
                disabled={false}
                renderLabelContent={renderMultiselectLabelContent}
                onSelect={seasonOnSelect}
            />
            <Button className={styles['next-season-button']} data-action={'next'} onClick={prevNextButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_arrow_right'} />
            </Button>
        </div>
    );
};

SeasonsBar.propTypes = {
    className: PropTypes.string,
    seasons: PropTypes.arrayOf(PropTypes.number).isRequired,
    season: PropTypes.number.isRequired,
    onSelect: PropTypes.func
};

module.exports = SeasonsBar;

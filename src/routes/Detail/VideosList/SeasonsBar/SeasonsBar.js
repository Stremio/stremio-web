const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
require('./styles');

const SeasonsBar = ({ className, season, seasons, onSeasonChange }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const setPrevSeason = React.useCallback(() => {
        if (Array.isArray(seasons)) {
            const seasonIndex = seasons.indexOf(season);
            if (seasonIndex > 0 && typeof onSeasonChange === 'function') {
                onSeasonChange(seasons[seasonIndex - 1]);
            }
        }
    }, [season, seasons, onSeasonChange]);
    const setNextSeason = React.useCallback(() => {
        if (Array.isArray(seasons)) {
            const seasonIndex = seasons.indexOf(season);
            if (seasonIndex < seasons.length - 1 && typeof onSeasonChange === 'function') {
                onSeasonChange(seasons[seasonIndex + 1]);
            }
        }
    }, [season, seasons, onSeasonChange]);
    const seasonOnClick = React.useCallback((event) => {
        closeMenu();
        const season = parseInt(event.currentTarget.dataset.season);
        if (!isNaN(season) && typeof onSeasonChange === 'function') {
            onSeasonChange(season);
        }
    }, [onSeasonChange]);
    return (
        <div className={classnames(className, 'seasons-bar-container')}>
            <Button className={'prev-season-button'} onClick={setPrevSeason}>
                <Icon className={'icon'} icon={'ic_arrow_left'} />
            </Button>
            <Popup
                open={menuOpen}
                menuMatchLabelWidth={true}
                onCloseRequest={closeMenu}
                renderLabel={(ref) => (
                    <Button ref={ref} className={classnames('seasons-popup-label-container', { 'active': menuOpen })} title={`Season ${season}`} onClick={toggleMenu}>
                        <div className={'season-label'}>Season</div>
                        <div className={'number-label'}>{season}</div>
                    </Button>
                )}
                renderMenu={() => (
                    <div className={'seasons-menu-container'}>
                        {
                            Array.isArray(seasons) ?
                                seasons.map((season) => (
                                    <Button key={season} className={'season-option-container'} data-season={season} title={`Season ${season}`} onClick={seasonOnClick}>
                                        <div className={'season-label'}>Season</div>
                                        <div className={'number-label'}>{season}</div>
                                    </Button>
                                ))
                                :
                                null
                        }
                    </div>
                )}
            />
            <Button className={'next-season-button'} onClick={setNextSeason}>
                <Icon className={'icon'} icon={'ic_arrow_right'} />
            </Button>
        </div>
    );
};

SeasonsBar.propTypes = {
    className: PropTypes.string,
    season: PropTypes.number,
    seasons: PropTypes.arrayOf(PropTypes.number),
    onSeasonChange: PropTypes.func
};

module.exports = SeasonsBar;

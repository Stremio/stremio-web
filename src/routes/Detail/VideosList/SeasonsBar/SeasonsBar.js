const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, Popup, useBinaryState } = require('stremio/common');
const styles = require('./styles');

const SeasonsBar = ({ className, season, seasons, onSeasonChange }) => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const setPrevSeason = React.useCallback(() => {
        if (Array.isArray(seasons) && typeof onSeasonChange === 'function') {
            const seasonIndex = seasons.indexOf(season);
            if (seasonIndex > 0) {
                onSeasonChange(seasons[seasonIndex - 1]);
            }
        }
    }, [season, seasons, onSeasonChange]);
    const setNextSeason = React.useCallback(() => {
        if (Array.isArray(seasons) && typeof onSeasonChange === 'function') {
            const seasonIndex = seasons.indexOf(season);
            if (seasonIndex < seasons.length - 1) {
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
        <div className={classnames(className, styles['seasons-bar-container'])}>
            <Button className={styles['prev-season-button']} onClick={setPrevSeason}>
                <Icon className={styles['icon']} icon={'ic_arrow_left'} />
            </Button>
            <Popup
                open={menuOpen}
                menuMatchLabelWidth={true}
                onCloseRequest={closeMenu}
                renderLabel={(ref) => (
                    <Button ref={ref} className={classnames(styles['seasons-popup-label-container'], { 'active': menuOpen })} title={season !== null && !isNaN(season) ? `Season ${season}` : 'Season'} onClick={toggleMenu}>
                        <div className={styles['season-label']}>Season</div>
                        {
                            season !== null && !isNaN(season) ?
                                <div className={styles['number-label']}>{season}</div>
                                :
                                null
                        }
                    </Button>
                )}
                renderMenu={() => (
                    <div className={styles['seasons-menu-container']}>
                        {
                            Array.isArray(seasons) ?
                                seasons.map((season) => (
                                    <Button key={season} className={styles['season-option-container']} data-season={season} title={season !== null && !isNaN(season) ? `Season ${season}` : 'Season'} onClick={seasonOnClick}>
                                        <div className={styles['season-label']}>Season</div>
                                        {
                                            season !== null && !isNaN(season) ?
                                                <div className={styles['number-label']}>{season}</div>
                                                :
                                                null
                                        }
                                    </Button>
                                ))
                                :
                                null
                        }
                    </div>
                )}
            />
            <Button className={styles['next-season-button']} onClick={setNextSeason}>
                <Icon className={styles['icon']} icon={'ic_arrow_right'} />
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

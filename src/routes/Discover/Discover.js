const React = require('react');
const { NavBar, MetaItem } = require('stremio-common');
const styles = require('./styles');

const Discover = () => {


    return (
        <div className={styles['discover-container']}>
            <NavBar
                className={styles['nav-bar']}
                backButton={false}
                tabs={[
                    { label: 'Board', icon: 'ic_board', href: '#/' },
                    { label: 'Discover', icon: 'ic_discover', href: '#/discover' },
                    { label: 'Library', icon: 'ic_library', href: '#/library' },
                    { label: 'Calendar', icon: 'ic_calendar', href: '#/calendar' },
                ]}
                searchBar={true}
                userMenu={true}
            />
            <div className={styles['discover-content']}>
                <div className={styles['meta-items-container']}>
                    {
                        Array(145).fill(null).map((_, index) => (
                            <div key={index} className={styles['meta-item-container']}>
                                <MetaItem
                                    className={styles['meta-item']}
                                    id={`tt${index}`}
                                    type={'movie'}
                                    title={index === 4 ? 'title' : ''}
                                    posterShape={'poster'}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

module.exports = Discover;

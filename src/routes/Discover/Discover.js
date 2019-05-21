const React = require('react');
const { NavBar, MetaItem } = require('stremio-common');
const useCatalog = require('./useCatalog');
const styles = require('./styles');

const Discover = () => {
    const catalog = useCatalog();
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
                    {catalog.map(({ id, type, name, posterShape }) => (
                        <div key={id} className={styles['meta-item-container']}>
                            <MetaItem
                                className={styles['meta-item']}
                                id={id}
                                type={type}
                                name={name}
                                posterShape={posterShape}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

module.exports = Discover;

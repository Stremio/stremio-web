const React = require('react');
const { NavBar } = require('stremio-common');
const styles = require('./styles');

class Library extends React.Component {
    render() {
        return (
            <React.Fragment>
                <NavBar
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
                <div className={styles['library-container']} />
            </React.Fragment>
        );
    }
}

module.exports = Library;

const React = require('react');
const { MainNavBar } = require('stremio-common');
const styles = require('./styles');

class Search extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MainNavBar />
                <div className={styles['search-container']} />
            </React.Fragment>
        );
    }
}

module.exports = Search;

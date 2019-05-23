const React = require('react');
const { MainNavBar } = require('stremio-common');
const styles = require('./styles');

class Library extends React.Component {
    render() {
        return (
            <div className={styles['library-container']}>
                <MainNavBar />
                <div className={styles['library-content']} />
            </div>
        );
    }
}

module.exports = Library;

const React = require('react');
const classnames = require('classnames');
const Route = require('stremio-router/Route');
const appStyles = require('stremio/App/styles');
const styles = require('./styles');

const RouterDecorator = ({ children }) => (
    <div id={'app'}>
        <div className={classnames('routes-container', appStyles['router'])}>
            <Route>
                <div className={styles['route-content-container']}>
                    {children}
                </div>
            </Route>
        </div>
    </div>
);

module.exports = RouterDecorator;

const React = require('react');
const classnames = require('classnames');
const { RoutesContainerProvider } = require('stremio-router/RoutesContainerContext');
const Route = require('stremio-router/Router/Route');
const routerStyles = require('stremio-router/Router/styles');
const appStyles = require('stremio/App/styles');
const styles = require('./styles');

const RouterDecorator = ({ children }) => (
    <div id={'app'}>
        <RoutesContainerProvider containerClassName={classnames(appStyles['router'], routerStyles['router-container'])}>
            <Route>
                <div className={styles['route-content-container']}>
                    {children}
                </div>
            </Route>
        </RoutesContainerProvider>
    </div>
);

module.exports = RouterDecorator;

const React = require('react');
const { RoutesContainerProvider } = require('stremio/router/RoutesContainerContext');
const Route = require('stremio/router/Route');
const { ScrollEventEmitter } = require('stremio/common');
const appStyles = require('stremio/App/styles');
const styles = require('./styles');

const RouterDecorator = ({ children }) => (
    <div id={'app'}>
        <ScrollEventEmitter className={appStyles['app-content']}>
            <RoutesContainerProvider className={appStyles['router']}>
                <Route>
                    <div className={styles['route-content-container']}>
                        {children}
                    </div>
                </Route>
            </RoutesContainerProvider>
        </ScrollEventEmitter>
    </div>
);

module.exports = RouterDecorator;

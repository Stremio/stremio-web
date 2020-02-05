const React = require('react');
const classnames = require('classnames');
const Route = require('stremio-router/Route');
const { RouteFocusedProvider } = require('stremio-router/RouteFocusedContext');
const { ToastsContainerProvider } = require('stremio/common/Toasts/ToastsContainerContext');
const appStyles = require('stremio/App/styles');
const styles = require('./styles');

const RouterDecorator = ({ children }) => (
    <div id={'app'}>
        <ToastsContainerProvider>
            <div className={classnames('routes-container', appStyles['router'])}>
                <RouteFocusedProvider value={true}>
                    <Route>
                        <div className={styles['route-content-container']}>
                            {children}
                        </div>
                    </Route>
                </RouteFocusedProvider>
            </div>
        </ToastsContainerProvider>
    </div>
);

module.exports = RouterDecorator;

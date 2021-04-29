const React = require('react');
const classnames = require('classnames');
const Route = require('stremio-router/Route');
const { RouteFocusedProvider } = require('stremio-router/RouteFocusedContext');
const ToastProvider = require('stremio/common/Toast/ToastProvider');
const appStyles = require('stremio/App/styles');
const styles = require('./styles');

const RouterDecorator = ({ children }) => (
    <div id={'app'}>
        <ToastProvider>
            <div className={classnames('routes-container', appStyles['router'])}>
                <RouteFocusedProvider value={true}>
                    <Route>
                        <div className={styles['route-content-container']}>
                            {children}
                        </div>
                    </Route>
                </RouteFocusedProvider>
            </div>
        </ToastProvider>
    </div>
);

module.exports = RouterDecorator;

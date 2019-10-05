const React = require('react');
const PropTypes = require('prop-types');
const FocusLock = require('react-focus-lock').default;
const { ModalsContainerProvider } = require('../ModalsContainerContext');

const Route = ({ children }) => {
    return (
        <div className={'route-container'}>
            <ModalsContainerProvider>
                <FocusLock className={'route-content'} autoFocus={false}>
                    {children}
                </FocusLock>
            </ModalsContainerProvider>
        </div>
    );
};

Route.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

module.exports = Route;

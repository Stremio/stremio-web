const React = require('react');
const PropTypes = require('prop-types');
const { FocusableProvider } = require('../FocusableContext');
const { ModalsContainerProvider } = require('../ModalsContainerContext');
const styles = require('./styles');

const Route = ({ children }) => {
    const onModalsContainerDomTreeChange = React.useCallback(({ modalsContainerElement }) => {
        return modalsContainerElement.childElementCount === 0;
    }, []);
    return (
        <div className={styles['route-container']}>
            <ModalsContainerProvider modalsContainerClassName={styles['modals-container']}>
                <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                    <div className={styles['route-content']}>
                        {children}
                    </div>
                </FocusableProvider>
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

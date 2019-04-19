const React = require('react');
const { FocusableProvider } = require('../FocusableContext');
const { ModalsContainerProvider } = require('../ModalsContainerContext');
const styles = require('./styles');

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
};

const Route = ({ children }) => (
    <div className={styles['route']}>
        <ModalsContainerProvider modalsContainerClassName={styles['modals-container']}>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div className={styles['route-content']}>
                    {children}
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    </div>
);

module.exports = Route;

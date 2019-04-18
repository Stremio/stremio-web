const React = require('react');
const FocusableProvider = require('../../Focusable/FocusableProvider');
const ModalsContainerProvider = require('../../Modal/ModalsContainerProvider');
const styles = require('./styles');

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
};

const Route = ({ children }) => (
    <div className={styles['route']}>
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div className={styles['route-content']}>
                    {children}
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    </div>
);

module.exports = Route;

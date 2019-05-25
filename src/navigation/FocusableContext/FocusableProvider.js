const React = require('react');
const PropTypes = require('prop-types');
const { useRoutesContainer } = require('../RoutesContainerContext');
const { useModalsContainer } = require('../ModalsContainerContext');
const FocusableContext = require('./FocusableContext');

const FocusableProvider = ({ children, onRoutesContainerDomTreeChange, onModalsContainerDomTreeChange }) => {
    const routesContainer = useRoutesContainer();
    const modalsContainer = useModalsContainer();
    const contentContainerRef = React.useRef(null);
    const [focusable, setFocusable] = React.useState(false);
    React.useEffect(() => {
        const onDomTreeChange = () => {
            const focusable =
                onRoutesContainerDomTreeChange({
                    routesContainer: routesContainer,
                    contentContainer: contentContainerRef.current
                })
                &&
                onModalsContainerDomTreeChange({
                    modalsContainer: modalsContainer,
                    contentContainer: contentContainerRef.current
                });
            if (focusable) {
                contentContainerRef.current.focus();
            }

            setFocusable(focusable);
        };
        const routesContainerDomTreeObserver = new MutationObserver(onDomTreeChange);
        const modalsContainerDomTreeObserver = new MutationObserver(onDomTreeChange);
        routesContainerDomTreeObserver.observe(routesContainer, { childList: true });
        modalsContainerDomTreeObserver.observe(modalsContainer, { childList: true });
        onDomTreeChange();
        return () => {
            routesContainerDomTreeObserver.disconnect();
            modalsContainerDomTreeObserver.disconnect();
        }
    }, [routesContainer, modalsContainer, onRoutesContainerDomTreeChange, onModalsContainerDomTreeChange]);
    return (
        <FocusableContext.Provider value={focusable}>
            {React.cloneElement(React.Children.only(children), { ref: contentContainerRef, tabIndex: -1 })}
        </FocusableContext.Provider>
    );
};

FocusableProvider.propTypes = {
    children: PropTypes.node.isRequired,
    onModalsContainerDomTreeChange: PropTypes.func.isRequired,
    onRoutesContainerDomTreeChange: PropTypes.func.isRequired
};

module.exports = FocusableProvider;

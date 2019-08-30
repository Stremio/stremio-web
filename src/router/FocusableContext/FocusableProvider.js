const React = require('react');
const PropTypes = require('prop-types');
const { useModalsContainer } = require('../ModalsContainerContext');
const { useRoutesContainer } = require('../RoutesContainerContext');
const FocusableContext = require('./FocusableContext');

const FocusableProvider = ({ children, onRoutesContainerChildrenChange, onModalsContainerChildrenChange }) => {
    const routesContainer = useRoutesContainer();
    const modalsContainer = useModalsContainer();
    const contentContainerRef = React.useRef(null);
    const [focusable, setFocusable] = React.useState(false);
    React.useEffect(() => {
        const onContainerChildrenChange = () => {
            setFocusable(
                onRoutesContainerChildrenChange({
                    routesContainer: routesContainer,
                    contentContainer: contentContainerRef.current
                })
                &&
                onModalsContainerChildrenChange({
                    modalsContainer: modalsContainer,
                    contentContainer: contentContainerRef.current
                })
            );
        };
        const routesContainerChildrenObserver = new MutationObserver(onContainerChildrenChange);
        const modalsContainerChildrenObserver = new MutationObserver(onContainerChildrenChange);
        routesContainerChildrenObserver.observe(routesContainer, { childList: true });
        modalsContainerChildrenObserver.observe(modalsContainer, { childList: true });
        onContainerChildrenChange();
        return () => {
            routesContainerChildrenObserver.disconnect();
            modalsContainerChildrenObserver.disconnect();
        };
    }, [routesContainer, modalsContainer, onRoutesContainerChildrenChange, onModalsContainerChildrenChange]);
    React.useEffect(() => {
        if (focusable && !contentContainerRef.current.contains(document.activeElement)) {
            contentContainerRef.current.focus();
        }
    }, [focusable]);
    return (
        <FocusableContext.Provider value={focusable}>
            {React.cloneElement(React.Children.only(children), {
                ref: contentContainerRef,
                tabIndex: -1
            })}
        </FocusableContext.Provider>
    );
};

FocusableProvider.propTypes = {
    children: PropTypes.node.isRequired,
    onRoutesContainerChildrenChange: PropTypes.func.isRequired,
    onModalsContainerChildrenChange: PropTypes.func.isRequired
};

module.exports = FocusableProvider;

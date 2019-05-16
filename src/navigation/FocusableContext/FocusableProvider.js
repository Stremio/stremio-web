const React = require('react');
const PropTypes = require('prop-types');
const { useRoutesContainer } = require('../RoutesContainerContext');
const { useModalsContainer } = require('../ModalsContainerContext');
const FocusableContext = require('./FocusableContext');

const FocusableProvider = ({ children, ...props }) => {
    const routesContainer = useRoutesContainer();
    const modalsContainer = useModalsContainer();
    const contentContainerRef = React.useRef();
    const [focusable, setFocusable] = React.useState(false);
    const onFocusableChange = React.useCallback(() => {
        const focusable =
            props.onModalsContainerDomTreeChange({
                modalsContainer: modalsContainer,
                contentContainer: contentContainerRef.current
            })
            &&
            props.onRoutesContainerDomTreeChange({
                routesContainer: routesContainer,
                contentContainer: contentContainerRef.current
            });
        setFocusable(focusable);
    }, []);
    const [modalsContainerDomTreeObserver, routesContainerDomTreeObserver] = React.useMemo(() => {
        return [new MutationObserver(onFocusableChange), new MutationObserver(onFocusableChange)];
    }, []);
    React.useEffect(() => {
        onFocusableChange();
        modalsContainerDomTreeObserver.observe(modalsContainer, { childList: true });
        routesContainerDomTreeObserver.observe(routesContainer, { childList: true });
        return () => {
            modalsContainerDomTreeObserver.disconnect();
            routesContainerDomTreeObserver.disconnect();
        }
    }, []);
    React.useEffect(() => {
        if (focusable) {
            contentContainerRef.current.focus();
        }
    }, [focusable]);
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

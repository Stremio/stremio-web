const React = require('react');
const PropTypes = require('prop-types');
const { useRoutesContainer } = require('../RoutesContainerContext');
const { useModalsContainer } = require('../ModalsContainerContext');
const FocusableContext = require('./FocusableContext');

const FocusableProvider = ({ children, onRoutesContainerChildrenChange, onModalsContainerChildrenChange }) => {
    const routesContainer = useRoutesContainer();
    const modalsContainer = useModalsContainer();
    const contentContainerRef = React.useRef(null);
    const [focusable, setFocusable] = React.useState(true);
    React.useEffect(() => {
        const onContainersChildrenChange = () => {
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
        routesContainer.addEventListener('childrenchange', onContainersChildrenChange);
        modalsContainer.addEventListener('childrenchange', onContainersChildrenChange);
        return () => {
            routesContainer.removeEventListener('childrenchange', onContainersChildrenChange);
            modalsContainer.removeEventListener('childrenchange', onContainersChildrenChange);
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
    onModalsContainerChildrenChange: PropTypes.func.isRequired,
    onRoutesContainerChildrenChange: PropTypes.func.isRequired
};

module.exports = FocusableProvider;

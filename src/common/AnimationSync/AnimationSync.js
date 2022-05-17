// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');

const AnimationSyncContext = React.createContext(null);

const AnimationSyncProvider = ({ children }) => {
    const [animations, setAnimations] = React.useState([]);
    const listenersCleanup = React.useRef([]);
    const register = React.useCallback((name, element) => {
        setAnimations((animations) => [...new Set([
            ...animations,
            {
                name,
                element
            }
        ])]);
    }, []);
    const unregister = React.useCallback((name, element) => {
        setAnimations((animations) => animations
            .filter((animation) => !(animation.name === name && animation.element === element)));
    }, []);
    React.useLayoutEffect(() => {
        const onAnimationIteration = (name) => {
            const cssAnimations = document.getAnimations();
            cssAnimations.forEach((cssAnimation) => {
                const { target } = cssAnimation.effect;
                const animation = animations.find(({ element }) => element === target);
                if (animation.name === name) {
                    cssAnimation.cancel();
                    cssAnimation.play();
                }
            });
        };
        if (animations.length > 0) {
            const animationNames = [...new Set(animations.map(({ name }) => name))];
            const animationsCleanup = animationNames.map((name) => {
                const { element } = animations.find((animation) => animation.name === name);
                const listener = onAnimationIteration.bind(null, name);
                element.addEventListener('animationiteration', listener);
                return () => element.removeEventListener('animationiteration', listener);
            });
            listenersCleanup.current = [
                ...listenersCleanup.current,
                ...animationsCleanup
            ];
        }
        return () => listenersCleanup.current.map((clean) => clean());
    }, [animations]);
    return (
        <AnimationSyncContext.Provider value={{ register, unregister }}>
            { children }
        </AnimationSyncContext.Provider>
    );
};

AnimationSyncProvider.propTypes = {
    children: PropTypes.node
};

const useAnimationSync = () => {
    return React.useContext(AnimationSyncContext);
};

module.exports = {
    useAnimationSync,
    AnimationSyncProvider
};

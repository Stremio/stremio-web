const React = require('react');
const classnames = require('classnames');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { Button, Popup, useBinaryState } = require('stremio/common');
const styles = require('./styles');

storiesOf('Popup', module).add('Popup', () => {
    const [menuOpen, openMenu, closeMenu, toggleMenu] = useBinaryState(false);
    const popupLabelOnClick = React.useCallback((event) => {
        if (!event.nativeEvent.togglePopupPrevented) {
            toggleMenu();
        }
    }, [toggleMenu]);
    const popupMenuOnClick = React.useCallback((event) => {
        event.nativeEvent.togglePopupPrevented = true;
    }, []);
    const popupMenuOnKeyDown = React.useCallback((event) => {
        event.nativeEvent.buttonClickPrevented = true;
    }, []);
    const onCloseRequest = React.useCallback((event) => {
        action('onCloseRequest')(event);
        closeMenu();
    }, []);
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <Popup
            open={menuOpen}
            direction={'bottom'}
            renderLabel={({ className, children, ...props }) => (
                <Button {...props} className={classnames(className, styles['popup-label-container'])} onClick={popupLabelOnClick}>
                    POPUP LABEL
                    {children}
                </Button>
            )}
            renderMenu={() => (
                <div className={styles['menu-container']} onKeyDown={popupMenuOnKeyDown} onClick={popupMenuOnClick}>
                    {Array(10).fill(null).map((_, index) => (
                        <Button key={index} className={styles['random-button']} onClick={action('Click Me')}>Click Me</Button>
                    ))}
                </div>
            )}
            dataset={{ prop: 'value' }}
            onCloseRequest={onCloseRequest}
            data-prop={'data-value'}
            onMouseEnter={domEventHandler}
        />
    );
});

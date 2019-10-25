const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const Multiselect = require('stremio/common/Multiselect');
const useDataset = require('stremio/common/useDataset');
const styles = require('./styles');

const PaginateInput = ({ className, options, selected, onSelect, ...props }) => {
    const dataset = useDataset(props);
    const selectedLabelText = React.useMemo(() => {
        if (Array.isArray(options)) {
            const selectedOption = options.find(({ value }) => {
                return selected === value;
            });
            if (selectedOption && typeof selectedOption.label === 'string') {
                return selectedOption.label;
            }
        }

        return selected;
    }, [options, selected]);
    const prevButtonOnClick = React.useCallback((event) => {
        if (typeof onSelect === 'function') {
            if (Array.isArray(options) && options.length > 0) {
                const selectedIndex = options.findIndex(({ value }) => {
                    return selected === value;
                });
                const prevIndex = Math.max(selectedIndex - 1, 0);
                const prevValue = options[prevIndex];
                onSelect({
                    type: 'select',
                    value: prevValue,
                    dataset: dataset,
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            } else {
                const prevValue = Math.max(selected - 1, 0);
                onSelect({
                    type: 'select',
                    value: prevValue,
                    dataset: dataset,
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            }
        }
    }, [dataset, options, selected, onSelect]);
    const nextButtonOnClick = React.useCallback((event) => {
        if (typeof onSelect === 'function') {
            if (Array.isArray(options) && options.length > 0) {
                const selectedIndex = options.findIndex(({ value }) => {
                    return selected === value;
                });
                const nextIndex = Math.max(selectedIndex + 1, options.length - 1);
                const nextValue = options[nextIndex];
                onSelect({
                    type: 'select',
                    value: nextValue,
                    dataset: dataset,
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            } else {
                const nextValue = selected + 1;
                onSelect({
                    type: 'select',
                    value: nextValue,
                    dataset: dataset,
                    reactEvent: event,
                    nativeEvent: event.nativeEvent
                });
            }
        }
    }, [dataset, options, selected, onSelect]);
    const optionOnSelect = React.useCallback((event) => {
        const page = parseInt(event.value);
        if (!isNaN(page) && typeof onSelect === 'function') {
            onSelect({
                type: 'select',
                value: page,
                dataset: dataset,
                reactEvent: event.reactEvent,
                nativeEvent: event.nativeEvent
            });
        }
    }, [onSelect]);
    return (
        <div className={classnames(className, styles['paginate-input-container'])}>
            <Button className={styles['prev-button-container']} onClick={prevButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_arrow_left'} />
            </Button>
            <Multiselect
                className={styles['multiselect-label-container']}
                renderLabelContent={() => (
                    <div className={styles['multiselect-label']}>{selectedLabelText}</div>
                )}
                options={
                    Array.isArray(options) ?
                        options.map(({ value, label }) => ({
                            value: String(value),
                            label
                        }))
                        :
                        null
                }
                disabled={!Array.isArray(options) || options.length === 0}
                onSelect={optionOnSelect}
            />
            <Button className={styles['next-button-container']} onClick={nextButtonOnClick}>
                <Icon className={styles['icon']} icon={'ic_arrow_right'} />
            </Button>
        </div>
    );
};

PaginateInput.propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string
    })),
    selected: PropTypes.number.isRequired,
    onSelect: PropTypes.func
};

module.exports = PaginateInput;

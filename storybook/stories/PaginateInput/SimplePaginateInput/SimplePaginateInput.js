const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { PaginateInput } = require('stremio/common');
const styles = require('./styles');

storiesOf('PaginateInput', module).add('SimplePaginateInput', () => {
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <PaginateInput
            className={styles['paginate-input']}
            label={'5'}
            dataset={{ 'dataset-prop': 'dataset-value' }}
            data-prop={'data-value'}
            onSelect={action('onSelect')}
            onClick={domEventHandler}
        />
    );
});

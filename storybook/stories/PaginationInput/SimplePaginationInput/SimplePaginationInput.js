// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { PaginationInput } = require('stremio/common');
const styles = require('./styles');

storiesOf('PaginationInput', module).add('SimplePaginationInput', () => {
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <PaginationInput
            className={styles['pagination-input']}
            label={'5'}
            dataset={{ 'dataset-prop': 'dataset-value' }}
            data-prop={'data-value'}
            onSelect={action('onSelect')}
            onClick={domEventHandler}
        />
    );
});

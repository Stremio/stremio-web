// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const { MetaItem } = require('stremio/common');
const styles = require('./styles');

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        value: 'play'
    },
    {
        label: 'Dismiss',
        value: 'dismiss'
    }
];

storiesOf('MetaItem', module).add('SаmpleMetaItem', () => {
    const domEventHandler = React.useCallback((event) => {
        action('domEventHandler')(event.currentTarget.dataset);
    }, []);
    return (
        <MetaItem
            className={styles['meta-item']}
            type={'movie'}
            name={'Sample meta item'}
            poster={'/images/intro_background.jpg'}
            posterShape={'poster'}
            playIcon={true}
            progress={0.4}
            options={CONTINUE_WATCHING_MENU}
            dataset={{ id: 'pt1' }}
            optionOnSelect={action('optionOnSelect')}
            data-id={'meta-item-id'}
            onClick={domEventHandler}
        />
    );
});

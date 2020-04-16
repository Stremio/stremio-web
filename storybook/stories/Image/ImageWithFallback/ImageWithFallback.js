// Copyright (C) 2017-2020 Smart code 203358507

const React = require('react');
const { storiesOf } = require('@storybook/react');
const { action } = require('@storybook/addon-actions');
const Icon = require('stremio-icons/dom');
const { Image } = require('stremio/common');
const styles = require('./styles');

storiesOf('Image', module).add('ImageWithFallback', () => {
    const renderFallback = React.useMemo(() => () => (
        <Icon className={styles['icon']} icon={'ic_broken_link'} />
    ));
    return (
        <Image
            className={styles['image']}
            src={'/images/non_existing.png'}
            onError={action('onError')}
            renderFallback={renderFallback}
        />
    );
});

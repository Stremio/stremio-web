const React = require('react');
const { addDecorator, configure } = require('@storybook/react');
const RouterDecorator = require('./RouterDecorator');

addDecorator((childrenFn) => (
    <RouterDecorator>
        {childrenFn()}
    </RouterDecorator>
));
configure(() => {
    require('./stories');
}, module);

const React = require('react');
const { withConsole } = require('@storybook/addon-console');
const { addDecorator, configure } = require('@storybook/react');
const RouterDecorator = require('./RouterDecorator');

addDecorator((renderStory, context) => withConsole()(renderStory)(context));
addDecorator((renderStory) => (
    <RouterDecorator>
        {renderStory()}
    </RouterDecorator>
));
configure(() => {
    require('./stories');
}, module);

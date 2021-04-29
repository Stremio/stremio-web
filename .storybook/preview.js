const React = require('react');
const { withConsole } = require('@storybook/addon-console');
const { addDecorator, addParameters, configure } = require('@storybook/react');
const { jsxDecorator } = require('storybook-addon-jsx');
const RouterDecorator = require('./RouterDecorator');
require('spatial-navigation-polyfill');
require('./styles');

window.top.__spatialNavigation__ = {
    keyMode: 'ARROW'
};

addParameters({
    jsx: {
        indent_size: 4,
        showFunctions: false
    }
});
addDecorator((renderStory, context) => jsxDecorator(renderStory, context));
addDecorator((renderStory, context) => withConsole()(renderStory)(context));
addDecorator((renderStory) => (
    <RouterDecorator>
        {renderStory()}
    </RouterDecorator>
));
configure(() => {
    require('../src/stories');
}, module);

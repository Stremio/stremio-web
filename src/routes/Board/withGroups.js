const React = require('react');

const withGroups = (Component) => {
    return class withGroups extends React.PureComponent {
        constructor(props) {
            super(props);

            this.state = {
                groups: []
            };
        }

        componentDidMount() {
            window.stateContainer.on('NewState', this.onUpdate);
            window.stateContainer.dispatch({
                action: 'Load',
                args: {
                    load: 'CatalogGrouped',
                    args: { extra: [] }
                }
            });
        }

        componentWillUnmount() {
            window.stateContainer.off('NewState', this.onUpdate);
        }

        onUpdate = (args) => {
            const state = window.stateContainer.getState();
            const groups = state.groups.reduce((groups, [request, response], index) => {
                if (response.type === 'Ready') {
                    groups.push({
                        id: `${index}${request.transport_url}`,
                        items: response.content.map((item) => {
                            return {
                                ...item,
                                title: item.name,
                                posterShape: item.posterShape || 'poster'
                            };
                        })
                    });
                }

                return groups;
            }, []);
            this.setState({ groups });
        }

        render() {
            return (
                <Component {...this.props} {...this.state} />
            );
        }
    }
}

module.exports = withGroups;

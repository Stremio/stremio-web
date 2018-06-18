import React, { Component } from 'react';
import { matchPath, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import styles from './styles';

class SearchInput extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({
            isActive: false,
            query: ''
        }, this.getStateFromProps(props));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            const nextState = this.getStateFromProps(nextProps);
            this.setState(nextState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.query !== this.state.query ||
            nextState.isActive !== this.state.isActive;
    }

    getStateFromProps = (props) => {
        const nextState = {
            isActive: !!matchPath(props.location.pathname, { path: '/search' })
        };

        if (nextState.isActive) {
            const queryParams = new URLSearchParams(props.location.search);
            nextState.query = queryParams.get('query') || '';
        }

        return nextState;
    }

    search = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('query', this.state.query);
        this.props.history.replace(`/search?${queryParams.toString()}`);
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        event.target.elements[0].blur();
        this.search();
    }

    onQueryInputChange = (event) => {
        const query = event.target.value;
        this.setState({ query });
    }

    onQueryInputFocus = (event) => {
        if (!this.state.isActive) {
            this.search();
        }
    }

    render() {
        return (
            <form className={classnames(styles['search-form'], { [styles['active']]: this.state.isActive })} onSubmit={this.onFormSubmit}>
                <label className={styles['search-label']}>
                    <input
                        type={'text'}
                        placeholder={'Search'}
                        value={this.state.query}
                        onChange={this.onQueryInputChange}
                        onFocus={this.onQueryInputFocus}
                        autoCorrect={'off'}
                        autoCapitalize={'off'}
                        spellCheck={false}
                    />
                    <input type={'submit'} />
                </label>
            </form>
        );
    }
}

export default withRouter(SearchInput);

import React, { Component } from 'react';
import { matchPath, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import styles from './styles';

class SearchInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: ''
        };
    }

    componentDidMount() {
        if (this.isActive(this.props.location)) {
            this.onQueryParamsChange(this.props.location.search);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location && this.isActive(nextProps.location)) {
            this.onQueryParamsChange(nextProps.location.search);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.query !== this.state.query;
    }

    onQueryParamsChange = (params) => {
        const queryParams = new URLSearchParams(params);
        const query = queryParams.get('query') || '';
        this.setState({ query });
    }

    isActive = (location) => {
        return !!matchPath(location.pathname, { path: '/search' });
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
        if (!this.isActive(this.props.location)) {
            this.search();
        }
    }

    render() {
        return (
            <form className={classnames(styles['search-form'], { [styles['active']]: this.isActive(this.props.location) })} onSubmit={this.onFormSubmit}>
                <label className={styles['search-label']}>
                    <input
                        type={'text'}
                        placeholder={'Search'}
                        value={this.state.query}
                        onChange={this.onQueryInputChange}
                        onFocus={this.onQueryInputFocus}
                    />
                    <input type={'submit'} />
                </label>
            </form>
        );
    }
}

export default withRouter(SearchInput);

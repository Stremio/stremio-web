const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Button = require('stremio/common/Button');
const styles = require('./styles');
const Icon = require('@stremio/stremio-icons/dom');

const Filters = ({ className, children }) => {
    const [filtersMenuOpen, setFiltersMenuOpen] = React.useState(false);
    return (
        <div className={classnames(className, styles['filters-container'])}>
            <Button className={styles['filters-button-container']} title={'Filter items'} onClick={() => setFiltersMenuOpen(!filtersMenuOpen)}>
                <Icon className={styles['icon']} icon={'ic_filter'} />
            </Button>
            {
                filtersMenuOpen ?
                    <div className={styles['filters-menu-container']}>
                        { children }
                    </div>
                    :
                    null
            }
        </div>
    );
};

Filters.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

module.exports = Filters;

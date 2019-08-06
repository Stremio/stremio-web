const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, MetaItem } = require('stremio/common');
require('./styles');

const BoardRow = ({ className, title, items = [], itemMenuOptions = [] }) => {
    return (
        <div className={classnames(className, 'board-row-container')}>
            <div className={'title-container'}>{title}</div>
            <div className={'meta-items-container'}>
                {items.map((item) => (
                    <MetaItem
                        {...item}
                        key={item.id}
                        className={classnames('meta-item', `poster-shape-${item.posterShape}`)}
                        title={item.name}
                        menuOptions={itemMenuOptions}
                    />
                ))}
            </div>
            <Button className={'see-all-container'} title={'SEE ALL'}>
                <div className={'label'}>SEE ALL</div>
                <Icon className={'icon'} icon={'ic_arrow_thin_right'} />
            </Button>
        </div>
    );
};

BoardRow.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        posterShape: PropTypes.string.isRequired,
    })),
    itemMenuOptions: PropTypes.array
};

module.exports = BoardRow;

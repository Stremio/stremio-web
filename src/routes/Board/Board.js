const React = require('react');
const classnames = require('classnames');
const { MetaItem, Input } = require('stremio-common');
const withGroups = require('./withGroups');
const styles = require('./styles');

const CONTINUE_WATCHING_MENU = [
    {
        label: 'Play',
        type: 'play'
    },
    {
        label: 'Dismiss',
        type: 'dismiss'
    }
];

class Board extends React.PureComponent {
    onClick = (event) => {
        console.log('onClick', {
            id: event.currentTarget.dataset.metaItemId,
            defaultPrevented: event.isDefaultPrevented(),
            propagationStopped: event.isPropagationStopped()
        });
    }

    menuOptionOnSelect = (event) => {
        console.log('menuOptionOnSelect', {
            id: event.currentTarget.dataset.metaItemId,
            type: event.currentTarget.dataset.menuOptionType,
            defaultPrevented: event.isDefaultPrevented(),
            propagationStopped: event.isPropagationStopped()
        });
    }

    renderMetaItemPlaceholders() {
        const metaItemPlaceholders = [];
        for (let placeholderNumber = 0; placeholderNumber < 20; placeholderNumber++) {
            metaItemPlaceholders.push(
                <div key={placeholderNumber} className={styles['placeholder']}>
                    <div className={styles['poster-image-placeholder']}>
                        <div className={styles['poster']} />
                    </div>
                    <div className={styles['title-bar-placeholder']} />
                </div>
            )
        }

        return (
            <div className={styles['placeholder-container']}>
                {metaItemPlaceholders}
            </div>
        );
    }

    render() {
        return (
            <div className={styles['board-container']}>
                {
                    this.props.groups.length === 0 ?
                        this.renderMetaItemPlaceholders()
                        :
                        <React.Fragment>
                            <div className={classnames(styles['board-row'], styles['continue-watching-row'])}>
                                <div className={styles['meta-items-container']}>
                                    {this.props.groups[0].items.map((item) => (
                                        <MetaItem
                                            {...item}
                                            key={item.id}
                                            className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape === 'landscape' ? 'square' : item.posterShape}`])}
                                            modalContainerClassName={styles['modal-container']}
                                            posterShape={item.posterShape === 'landscape' ? 'square' : item.posterShape}
                                            menuOptions={CONTINUE_WATCHING_MENU}
                                            menuOptionOnSelect={this.menuOptionOnSelect}
                                            onClick={this.onClick}
                                        />
                                    ))}
                                </div>
                                <Input className={styles['show-more-container']} type={'button'} />
                            </div>
                            {
                                this.props.groups.slice(1, this.props.groups.length).map((group) => {
                                    return (
                                        <div key={group.id} className={classnames(styles['board-row'], styles['addon-catalog-row'])}>
                                            <div className={styles['meta-items-container']}>
                                                {group.items.map((item, _, metaItems) => (
                                                    <MetaItem
                                                        {...item}
                                                        key={item.id}
                                                        className={classnames(styles['meta-item'], styles[`poster-shape-${metaItems[0].posterShape}`])}
                                                        posterShape={metaItems[0].posterShape}
                                                        progress={0}
                                                        onClick={this.onClick}
                                                    />
                                                ))}
                                            </div>
                                            <Input className={styles['show-more-container']} type={'button'} />
                                        </div>
                                    );
                                })
                            }
                        </React.Fragment>
                }
            </div>
        );
    }
}

module.exports = withGroups(Board);

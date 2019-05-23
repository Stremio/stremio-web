const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Input } = require('stremio-navigation')
const { MetaItem, MainNavBar } = require('stremio-common');
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

    render() {
        return (
            <div className={styles['board-container']}>
                <MainNavBar className={styles['nav-bar']} />
                <div className={styles['board-content']} tabIndex={-1}>
                    {
                        this.props.groups.length > 0 ?
                            <React.Fragment>
                                <div className={classnames(styles['board-row'], styles['continue-watching-row'])}>
                                    <div className={styles['meta-items-container']}>
                                        {this.props.groups[0].items.map((item) => (
                                            <MetaItem
                                                {...item}
                                                key={item.id}
                                                title={item.name}
                                                className={classnames(styles['meta-item'], styles[`poster-shape-${item.posterShape === 'landscape' ? 'square' : item.posterShape}`])}
                                                menuClassName={styles['menu-container']}
                                                posterShape={item.posterShape === 'landscape' ? 'square' : item.posterShape}
                                                menuOptions={CONTINUE_WATCHING_MENU}
                                                menuOptionOnSelect={this.menuOptionOnSelect}
                                                onClick={this.onClick}
                                            />
                                        ))}
                                    </div>
                                    <Input className={classnames(styles['show-more-container'], 'focusable-with-border')} type={'button'}>
                                        <div className={styles['label']}>SEE ALL</div>
                                        <Icon className={styles['icon']} icon={'ic_back_ios'} />
                                    </Input>
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
                                                            title={item.name}
                                                            className={classnames(styles['meta-item'], styles[`poster-shape-${metaItems[0].posterShape}`])}
                                                            posterShape={metaItems[0].posterShape}
                                                            progress={0}
                                                            onClick={this.onClick}
                                                        />
                                                    ))}
                                                </div>
                                                <Input className={classnames(styles['show-more-container'], 'focusable-with-border')} type={'button'}>
                                                    <div className={styles['label']}>SEE ALL</div>
                                                    <Icon className={styles['icon']} icon={'ic_back_ios'} />
                                                </Input>
                                            </div>
                                        );
                                    })
                                }
                            </React.Fragment>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}

module.exports = withGroups(Board);

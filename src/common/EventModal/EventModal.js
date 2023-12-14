// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const styles = require('./styles');
const Button = require('stremio/common/Button');
const ModalDialog = require('stremio/common/ModalDialog');
const useEvents = require('./useEvents');

const EventModal = () => {
    const { events, pullEvents, dismissEvent } = useEvents();

    const modal = React.useMemo(() => {
        return events?.modal?.type === 'Ready' ?
            events.modal.content
            :
            null;
    }, [events]);

    const onCloseRequest = React.useCallback(() => {
        modal?.id && dismissEvent(modal.id);
    }, [modal]);

    React.useEffect(() => {
        pullEvents();
    }, []);

    return (
        modal !== null ?
            <ModalDialog className={styles['notification-modal']} onCloseRequest={onCloseRequest}>
                {
                    modal.imageUrl ?
                        <img className={styles['notification-image']} src={modal.imageUrl} />
                        :
                        null
                }
                <div className={styles['info-container']}>
                    <div className={styles['title-container']}>
                        {
                            modal.title ?
                                <div className={styles['title']}>{modal.title}</div>
                                :
                                null
                        }
                        {
                            modal.message ?
                                <div className={styles['notification-label']}>{modal.message}</div>
                                :
                                null
                        }
                    </div>
                    {
                        modal.addon.manifestUrl ?
                            <Button className={styles['action-button']} href={`#/addons?addon=${encodeURIComponent(modal.addon.manifestUrl)}`} onClick={onCloseRequest}>
                                <div className={styles['button-label']}>Learn more</div>
                            </Button>
                            :
                            null
                    }
                </div>
            </ModalDialog>
            :
            null
    );
};

module.exports = EventModal;

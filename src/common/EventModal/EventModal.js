// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useTranslation } = require('react-i18next');
const Button = require('stremio/common/Button');
const ModalDialog = require('stremio/common/ModalDialog');
const useEvents = require('./useEvents');
const styles = require('./styles');
const { default: Icon } = require('@stremio/stremio-icons/react');

const EventModal = () => {
    const { t } = useTranslation();

    const { events, pullEvents, dismissEvent } = useEvents();

    const modal = React.useMemo(() => {
        return events?.modal?.type === 'Ready' ?
            events.modal.content
            :
            null;
    }, [events]);

    const onClose = React.useCallback(() => {
        modal?.id && dismissEvent(modal.id);
    }, [modal]);

    React.useEffect(() => {
        pullEvents();
    }, []);

    return (
        modal !== null ?
            <ModalDialog className={styles['event-modal']} onCloseRequest={onClose}>
                {
                    modal.imageUrl ?
                        <img className={styles['image']} src={modal.imageUrl} />
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
                                <div className={styles['label']}>{modal.message}</div>
                                :
                                null
                        }
                    </div>
                    {
                        modal?.addon?.name ?
                            <div className={styles['addon-container']}>
                                <Icon className={styles['icon']} name={'addons'} />
                                <div className={styles['name']}>
                                    { modal.addon.name }
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        modal?.addon?.manifestUrl ?
                            <Button className={styles['action-button']} href={`#/addons?addon=${encodeURIComponent(modal.addon.manifestUrl)}`} onClick={onClose}>
                                <div className={styles['button-label']}>
                                    { t('INSTALL_ADDON') }
                                </div>
                            </Button>
                            :
                            modal.externalUrl ?
                                <Button className={styles['action-button']} href={modal.externalUrl} target={'_blank'}>
                                    <div className={styles['button-label']}>
                                        { t('LEARN_MORE') }
                                    </div>
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

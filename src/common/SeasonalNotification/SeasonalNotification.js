// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const styles = require('./styles');
const { Button, ModalDialog } = require('../../common');
const useBinaryState = require('stremio/common/useBinaryState');
const useFetchNotificationData = require('./useFetchNotificationData');

const SeasonalNotification = () => {
    const { notificationModalData, isModalDataLoading } = useFetchNotificationData();
    const [isNotificationModalOpen, , closeNotificationModal] = useBinaryState(true);

    return (
        notificationModalData !== null && !isModalDataLoading && isNotificationModalOpen ?
            <ModalDialog className={styles['notification-modal']} onCloseRequest={closeNotificationModal}>
                {
                    notificationModalData.imageUrl ?
                        <img className={styles['notification-image']} src={notificationModalData.imageUrl} />
                        :
                        null
                }
                <div className={styles['info-container']}>
                    <div className={styles['title-container']}>
                        {
                            notificationModalData.title ?
                                <div className={styles['title']}>{notificationModalData.title}</div>
                                :
                                null
                        }
                        {
                            notificationModalData.message ?
                                <div className={styles['notification-label']}>{notificationModalData.message}</div>
                                :
                                null
                        }
                    </div>
                    {
                        notificationModalData.addon.manifestUrl ?
                            <Button className={styles['action-button']} href={notificationModalData.addon.manifestUrl}>
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

module.exports = SeasonalNotification;

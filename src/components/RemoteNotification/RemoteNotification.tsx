// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import ModalDialog from 'stremio/components/ModalDialog';
import useEvents from 'stremio/components/EventModal/useEvents';
import useRemoteConfig from 'stremio/common/RemoteConfig/useRemoteConfig';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import { usePlatform } from 'stremio/common/Platform';
import useBoardTransition from './useBoardTransition';
import styles from './styles.less';

const TEMPLATE = 'prompt';
const DEEP_LINK_PREFIX = 'stremio:///';

const RemoteNotification = () => {
    const platform = usePlatform();
    const navigate = useNavigate();
    const routeActive = useRouteActive();
    const { events } = useEvents();
    const { remoteConfig, pull, notificationShown, notificationAction, dismissNotification } = useRemoteConfig();
    const shownRef = useRef<string | null>(null);

    const legacyModalPending = events.modal.type === 'Loading' || (events.modal.type === 'Ready' && events.modal.content !== null);

    const notification = useMemo(() => {
        if (!routeActive || legacyModalPending) {
            return null;
        }

        return remoteConfig.notifications.find(({ template }) => template === TEMPLATE) ?? null;
    }, [routeActive, legacyModalPending, remoteConfig.notifications]);

    const armTransition = useBoardTransition(notification !== null);

    useEffect(() => {
        if (routeActive) {
            pull();
        }
    }, [routeActive, pull]);

    useEffect(() => {
        if (notification === null) {
            return;
        }

        const key = `${notification.id}:${notification.rev}`;
        if (shownRef.current !== key) {
            shownRef.current = key;
            notificationShown(notification.id);
        }
    }, [notification, notificationShown]);

    const onCloseRequest = useCallback(() => {
        if (notification !== null) {
            dismissNotification(notification.id);
        }
    }, [notification, dismissNotification]);

    const buttons = useMemo(() => {
        if (notification === null) {
            return [];
        }

        return notification.buttons.map((button) => ({
            className: button.style === 'primary' ? undefined : styles['secondary-button'],
            label: button.label,
            props: {
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                    armTransition(notification.id, event.currentTarget, event.detail === 0);
                    if (button.openUrl !== null) {
                        platform.openExternal(button.openUrl);
                    }
                    if (button.navigate !== null && button.navigate.startsWith(DEEP_LINK_PREFIX)) {
                        navigate(`/${button.navigate.slice(DEEP_LINK_PREFIX.length)}`);
                    }
                    notificationAction(notification.id, button.id);
                },
            },
        }));
    }, [notification, platform, navigate, notificationAction, armTransition]);

    if (notification === null) {
        return null;
    }

    return (
        <ModalDialog className={styles['remote-notification']} title={notification.title} buttons={buttons} onCloseRequest={onCloseRequest}>
            {
                notification.image !== null ?
                    <img className={styles['image']} src={notification.image} />
                    :
                    null
            }
            {
                notification.body !== null ?
                    <div className={styles['body']}>{notification.body}</div>
                    :
                    null
            }
        </ModalDialog>
    );
};

export default RemoteNotification;

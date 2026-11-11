// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Modal, useModalsContainer } from 'stremio-router';
import BottomSheet from 'stremio/components/BottomSheet';
import Button from 'stremio/components/Button';
import useMediaQuery from 'stremio/common/useMediaQuery';
import useRouteFocused from 'stremio/common/useRouteFocused';
import Peek from './Peek';
import type { Media } from './useMedia';
import styles from './styles.less';

type Props = {
    notification: RemoteNotification,
    media: Media,
    closing: boolean,
    held: boolean,
    onAction: (button: RemoteNotificationButton, event: React.MouseEvent<HTMLElement>) => void,
    onCloseRequest: () => void,
    onExited: () => void,
};

const SHEET_QUERY = `(max-width: ${styles.sheetWidth})`;
const EXIT_DURATION = Number.parseInt(styles.exitDurationMs, 10);

const Prompt = ({ notification, media, closing, held, onAction, onCloseRequest, onExited }: Props) => {
    const { t } = useTranslation();
    const titleId = useId();
    const bodyId = useId();
    const sheet = useMediaQuery(SHEET_QUERY);
    const routeFocused = useRouteFocused();
    const modalsContainer = useModalsContainer();
    const modalRef = useRef<HTMLElement>(null);
    const plain = media.peek === null && media.image === null;

    useEffect(() => {
        if (sheet || closing || held || !routeFocused) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape' && modalsContainer.childNodes[modalsContainer.childElementCount - 2] === modalRef.current) {
                onCloseRequest();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [sheet, closing, held, routeFocused, modalsContainer, onCloseRequest]);

    useEffect(() => {
        if (sheet || !closing) {
            return;
        }

        const timeout = window.setTimeout(onExited, EXIT_DURATION);
        return () => {
            window.clearTimeout(timeout);
        };
    }, [sheet, closing, onExited]);

    const content = (
        <>
            {
                media.peek !== null ?
                    <div className={styles['media']}>
                        <Peek {...media.peek} />
                    </div>
                    :
                    null
            }
            {
                media.peek === null && media.image !== null ?
                    <div className={styles['media']}>
                        <div className={styles['image']}>
                            <img className={styles['picture']} src={media.image} alt={''} draggable={false} />
                        </div>
                    </div>
                    :
                    null
            }
            <div className={styles['content']}>
                {
                    plain ?
                        <img className={styles['mark']} src={require('/assets/images/stremio_symbol.png')} alt={''} draggable={false} />
                        :
                        null
                }
                <h2 id={titleId} className={styles['title']}>{notification.title}</h2>
                {
                    notification.body !== null ?
                        <p id={bodyId} className={styles['body']}>{notification.body}</p>
                        :
                        null
                }
                {
                    notification.buttons.length > 0 ?
                        <div className={styles['actions']}>
                            {
                                notification.buttons.map((button) => (
                                    <Button
                                        key={button.id}
                                        className={classNames(styles['action'], styles[button.style === 'primary' ? 'primary' : 'secondary'])}
                                        onClick={(event) => onAction(button, event)}
                                    >
                                        <div className={styles['label']}>{button.label}</div>
                                    </Button>
                                ))
                            }
                        </div>
                        :
                        null
                }
            </div>
        </>
    );

    if (sheet) {
        return (
            <BottomSheet
                className={classNames(styles['sheet'], { [styles['plain']]: plain })}
                ariaLabel={notification.title}
                show={!closing}
                flush={true}
                closeOnContentClick={false}
                closeOnOrientationChange={false}
                onCloseRequest={onCloseRequest}
                onExited={onExited}
            >
                {content}
            </BottomSheet>
        );
    }

    return (
        <Modal ref={modalRef} className={classNames(styles['prompt'], { [styles['closing']]: closing })}>
            <div className={styles['scrim']} onClick={onCloseRequest} />
            <div
                className={classNames(styles['card'], { [styles['plain']]: plain })}
                role={'dialog'}
                aria-modal={'true'}
                aria-labelledby={titleId}
                aria-describedby={notification.body !== null ? bodyId : undefined}
            >
                {content}
                <Button className={styles['close']} title={t('BUTTON_CLOSE')} onClick={onCloseRequest}>
                    <Icon className={styles['icon']} name={'close'} />
                </Button>
            </div>
        </Modal>
    );
};

export default Prompt;

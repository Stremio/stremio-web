// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { useGamepad } from 'stremio/services';
import type { ControllerType } from 'stremio/services/GamepadContext';
import GamepadDiagram from './GamepadDiagram';
import styles from './styles.less';

const LEFT = '←';
const RIGHT = '→';
const UP = '↑';
const DOWN = '↓';

type FaceLabels = {
    bottom: string;
    right: string;
    left: string;
    top: string;
    lb: string;
    rb: string;
    lStick: string;
    rStick: string;
};

const LABELS: Record<ControllerType, FaceLabels> = {
    playstation: {
        bottom: '✕', right: '○', left: '□', top: '△',
        lb: 'L1', rb: 'R1',
        lStick: 'L stick', rStick: 'R stick',
    },
    xbox: {
        bottom: 'A', right: 'B', left: 'X', top: 'Y',
        lb: 'LB', rb: 'RB',
        lStick: 'L stick', rStick: 'R stick',
    },
    generic: {
        bottom: '✕', right: '○', left: '□', top: '△',
        lb: 'L1', rb: 'R1',
        lStick: 'L stick', rStick: 'R stick',
    },
};

type Props = {
    onClose: () => void,
};

const GamepadModal = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const gamepad = useGamepad();

    const labels = LABELS[gamepad?.controllerType ?? 'generic'];

    useEffect(() => {
        gamepad?.lock('gamepad-');
        const onKeyDown = ({ key }: KeyboardEvent) => {
            key === 'Escape' && onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        gamepad?.on('buttonB', 'gamepad-modal', onClose);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            gamepad?.off('buttonB', 'gamepad-modal');
            gamepad?.unlock();
        };
    }, [gamepad]);

    return createPortal((
        <div className={styles['gamepad-modal']} data-gamepad-modal>
            <div className={styles['backdrop']} onClick={onClose} />

            <div className={styles['container']}>
                <div className={styles['header']}>
                    <div className={styles['title']}>
                        {t('GAMEPAD_CONTROLS_TITLE')}
                    </div>

                    <Button className={styles['close-button']} title={t('BUTTON_CLOSE')} onClick={onClose}>
                        <Icon className={styles['icon']} name={'close'} />
                    </Button>
                </div>

                <div className={styles['content']}>
                    <GamepadDiagram />

                    <div className={styles['sections']}>
                        <div className={styles['section']}>
                            <div className={styles['section-title']}>{t('GAMEPAD_SECTION_NAVIGATION')}</div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.lStick}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_NAVIGATE')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.bottom}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_SELECT')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.right}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_BACK')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.top}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_FULLSCREEN')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.left}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_GUIDE')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.lb}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_PREV_TAB')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.rb}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_NEXT_TAB')}</span>
                            </div>
                        </div>

                        <div className={styles['section']}>
                            <div className={styles['section-title']}>{t('GAMEPAD_SECTION_PLAYER')}</div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.left}</kbd>
                                <span className={styles['dir']} />
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_PLAY_PAUSE')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.rStick}</kbd>
                                <span className={styles['dir']}>{LEFT}</span>
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_SEEK_BACK')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.rStick}</kbd>
                                <span className={styles['dir']}>{RIGHT}</span>
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_SEEK_FWD')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.rStick}</kbd>
                                <span className={styles['dir']}>{UP}</span>
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_VOL_UP')}</span>
                            </div>
                            <div className={styles['mapping']}>
                                <kbd className={styles['kbd']}>{labels.rStick}</kbd>
                                <span className={styles['dir']}>{DOWN}</span>
                                <span className={styles['action']}>{t('GAMEPAD_ACTION_VOL_DOWN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ), document.body);
};

export default GamepadModal;

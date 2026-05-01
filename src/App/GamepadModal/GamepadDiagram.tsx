// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGamepad } from 'stremio/services';
import type { ControllerType } from 'stremio/services/GamepadContext';
import styles from './styles.less';

type ActiveButton = string | null;

const CX = 400;
const ARROW = { UP: '↑', DOWN: '↓', LEFT: '←', RIGHT: '→' };

type FaceLayout = {
    top: { glyph: string; fontSize: number; weight: number };
    right: { glyph: string; fontSize: number; weight: number };
    bottom: { glyph: string; fontSize: number; weight: number };
    left: { glyph: string; fontSize: number; weight: number };
    lb: string;
    rb: string;
    lt: string;
    rt: string;
};

const LAYOUTS: Record<ControllerType, FaceLayout> = {
    playstation: {
        top:    { glyph: '△', fontSize: 12, weight: 400 },
        right:  { glyph: '○', fontSize: 12, weight: 400 },
        bottom: { glyph: '✕', fontSize: 12, weight: 400 },
        left:   { glyph: '□', fontSize: 12, weight: 400 },
        lb: 'L1', rb: 'R1', lt: 'L2', rt: 'R2',
    },
    xbox: {
        top:    { glyph: 'Y', fontSize: 11, weight: 700 },
        right:  { glyph: 'B', fontSize: 11, weight: 700 },
        bottom: { glyph: 'A', fontSize: 11, weight: 700 },
        left:   { glyph: 'X', fontSize: 11, weight: 700 },
        lb: 'LB', rb: 'RB', lt: 'LT', rt: 'RT',
    },
    generic: {
        top:    { glyph: '△', fontSize: 12, weight: 400 },
        right:  { glyph: '○', fontSize: 12, weight: 400 },
        bottom: { glyph: '✕', fontSize: 12, weight: 400 },
        left:   { glyph: '□', fontSize: 12, weight: 400 },
        lb: 'L1', rb: 'R1', lt: 'L2', rt: 'R2',
    },
};

const GamepadDiagram = () => {
    const { t } = useTranslation();
    const gamepad = useGamepad();
    const [active, setActive] = useState<ActiveButton>(null);

    const layout = LAYOUTS[gamepad?.controllerType ?? 'generic'];

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const flash = (button: string) => () => {
            setActive(button);
            clearTimeout(timeout);
            timeout = setTimeout(() => setActive(null), 400);
        };

        gamepad?.on('buttonA', 'gamepad-diagram', flash('bottom'));
        gamepad?.on('buttonB', 'gamepad-diagram', flash('right'));
        gamepad?.on('buttonX', 'gamepad-diagram', flash('left'));
        gamepad?.on('buttonY', 'gamepad-diagram', flash('top'));
        gamepad?.on('buttonLT', 'gamepad-diagram', flash('lb'));
        gamepad?.on('buttonRT', 'gamepad-diagram', flash('rb'));
        gamepad?.on('analog', 'gamepad-diagram', (dir) => dir && flash('stick-' + dir)());
        gamepad?.on('analogRight', 'gamepad-diagram', (dir) => dir && flash('rstick-' + dir)());

        return () => {
            clearTimeout(timeout);
            gamepad?.off('buttonA', 'gamepad-diagram');
            gamepad?.off('buttonB', 'gamepad-diagram');
            gamepad?.off('buttonX', 'gamepad-diagram');
            gamepad?.off('buttonY', 'gamepad-diagram');
            gamepad?.off('buttonLT', 'gamepad-diagram');
            gamepad?.off('buttonRT', 'gamepad-diagram');
            gamepad?.off('analog', 'gamepad-diagram');
            gamepad?.off('analogRight', 'gamepad-diagram');
        };
    }, [gamepad]);

    const glow = (id: string) => active === id ? '#7b5bf5' : undefined;
    const glowOp = (id: string) => active === id ? 1 : undefined;

    const SX = 130;
    const BX = 120;
    const STX = 75;
    const BY = 30;

    // Xbox controllers are asymmetric — left stick sits upper-left (where the
    // d-pad is on PlayStation) and the d-pad drops to the lower-left.
    const isXbox = (gamepad?.controllerType ?? 'generic') === 'xbox';
    const lstickPos = isXbox
        ? { cx: CX - BX, cy: 148 + BY }
        : { cx: CX - STX, cy: 240 + BY };
    const dpadPos = isXbox
        ? { cx: CX - STX, cy: 240 + BY }
        : { cx: CX - BX, cy: 149 + BY };
    const navLine = isXbox
        ? { x1: CX - BX - 24, y1: 148 + BY }
        : { x1: CX - STX - 24, y1: 232 + BY };

    return (
        <svg className={styles['diagram']} viewBox={'0 0 800 510'} xmlns={'http://www.w3.org/2000/svg'}>
            <defs>
                <linearGradient id={'bodyGrad'} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
                    <stop offset={'0%'} stopColor={'#2a2545'} />
                    <stop offset={'100%'} stopColor={'#1a1530'} />
                </linearGradient>
                <linearGradient id={'triggerGrad'} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
                    <stop offset={'0%'} stopColor={'#1e1a35'} />
                    <stop offset={'100%'} stopColor={'#16122a'} />
                </linearGradient>
                <linearGradient id={'bumperGrad'} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
                    <stop offset={'0%'} stopColor={'#3d3660'} />
                    <stop offset={'100%'} stopColor={'#2a2545'} />
                </linearGradient>
                <filter id={'glow'} x={'-50%'} y={'-50%'} width={'200%'} height={'200%'}>
                    <feGaussianBlur stdDeviation={'4'} result={'blur'} />
                    <feMerge>
                        <feMergeNode in={'blur'} />
                        <feMergeNode in={'SourceGraphic'} />
                    </feMerge>
                </filter>
            </defs>

            <g className={styles['anim-controls']}>
                <path
                    d={`M${CX - SX - 38},68 Q${CX - SX - 40},48 ${CX - SX - 28},42 L${CX - SX + 28},42 Q${CX - SX + 40},48 ${CX - SX + 38},68 Z`}
                    fill={'url(#triggerGrad)'} stroke={'#3d3660'} strokeWidth={'1'} opacity={'0.7'}
                />
                <text x={CX - SX} y={'58'} textAnchor={'middle'} fill={'#8b7faa'} fontSize={'8'} fontWeight={'500'}>{layout.lt}</text>
                <path
                    d={`M${CX + SX - 38},68 Q${CX + SX - 40},48 ${CX + SX - 28},42 L${CX + SX + 28},42 Q${CX + SX + 40},48 ${CX + SX + 38},68 Z`}
                    fill={'url(#triggerGrad)'} stroke={'#3d3660'} strokeWidth={'1'} opacity={'0.7'}
                />
                <text x={CX + SX} y={'58'} textAnchor={'middle'} fill={'#8b7faa'} fontSize={'8'} fontWeight={'500'}>{layout.rt}</text>
            </g>
            <path
                className={styles['anim-body']}
                d={
                    `M${CX - 178},${105 + BY}
                    Q${CX - 165},${80 + BY} ${CX - 95},${74 + BY}
                    L${CX + 95},${74 + BY}
                    Q${CX + 165},${80 + BY} ${CX + 178},${105 + BY}
                    L${CX + 195},${135 + BY}
                    Q${CX + 232},${172 + BY} ${CX + 252},${232 + BY}
                    Q${CX + 272},${298 + BY} ${CX + 255},${350 + BY}
                    Q${CX + 238},${390 + BY} ${CX + 203},${400 + BY}
                    Q${CX + 168},${410 + BY} ${CX + 150},${382 + BY}
                    L${CX + 113},${320 + BY}
                    Q${CX + 90},${284 + BY} ${CX},${284 + BY}
                    Q${CX - 90},${284 + BY} ${CX - 113},${320 + BY}
                    L${CX - 150},${382 + BY}
                    Q${CX - 168},${410 + BY} ${CX - 203},${400 + BY}
                    Q${CX - 238},${390 + BY} ${CX - 255},${350 + BY}
                    Q${CX - 272},${298 + BY} ${CX - 252},${232 + BY}
                    Q${CX - 232},${172 + BY} ${CX - 195},${135 + BY}
                    Z`
                }
                fill={'url(#bodyGrad)'}
                stroke={'#3d3660'}
                strokeWidth={'2.5'}
            />

            <g className={styles['anim-controls']}>
                <rect x={CX - 58} y={96 + BY} rx={'8'} ry={'8'} width={'116'} height={'48'} fill={'#1e1a35'} stroke={'#3d3660'} strokeWidth={'1.5'} />
                <g filter={active === 'lb' ? 'url(#glow)' : undefined}>
                    <path
                        d={`M${CX - SX - 40},74 Q${CX - SX - 38},66 ${CX - SX - 30},64 L${CX - SX + 30},64 Q${CX - SX + 38},66 ${CX - SX + 40},74 L${CX - SX + 36},82 Q${CX - SX + 34},85 ${CX - SX + 28},85 L${CX - SX - 28},85 Q${CX - SX - 34},85 ${CX - SX - 36},82 Z`}
                        fill={'url(#bumperGrad)'} stroke={glow('lb') || '#5848a0'} strokeWidth={'1.2'} opacity={glowOp('lb') || 0.9}
                    />
                    <text x={CX - SX} y={'78'} textAnchor={'middle'} fill={'#a89ecc'} fontSize={'9'} fontWeight={'600'}>{layout.lb}</text>
                </g>
                <g filter={active === 'rb' ? 'url(#glow)' : undefined}>
                    <path
                        d={`M${CX + SX - 40},74 Q${CX + SX - 38},66 ${CX + SX - 30},64 L${CX + SX + 30},64 Q${CX + SX + 38},66 ${CX + SX + 40},74 L${CX + SX + 36},82 Q${CX + SX + 34},85 ${CX + SX + 28},85 L${CX + SX - 28},85 Q${CX + SX - 34},85 ${CX + SX - 36},82 Z`}
                        fill={'url(#bumperGrad)'} stroke={glow('rb') || '#5848a0'} strokeWidth={'1.2'} opacity={glowOp('rb') || 0.9}
                    />
                    <text x={CX + SX} y={'78'} textAnchor={'middle'} fill={'#a89ecc'} fontSize={'9'} fontWeight={'600'}>{layout.rb}</text>
                </g>

                <g filter={active === 'top' ? 'url(#glow)' : undefined}>
                    <circle cx={CX + BX} cy={118 + BY} r={'15'} fill={'#1e1a35'} stroke={glow('top') || '#5848a0'} strokeWidth={'1.5'} />
                    <text x={CX + BX} y={123 + BY} textAnchor={'middle'} fill={active === 'top' ? '#fff' : '#a89ecc'} fontSize={layout.top.fontSize} fontWeight={layout.top.weight}>{layout.top.glyph}</text>
                </g>

                <g filter={active === 'right' ? 'url(#glow)' : undefined}>
                    <circle cx={CX + BX + 30} cy={148 + BY} r={'15'} fill={'#1e1a35'} stroke={glow('right') || '#5848a0'} strokeWidth={'1.5'} />
                    <text x={CX + BX + 30} y={153 + BY} textAnchor={'middle'} fill={active === 'right' ? '#fff' : '#a89ecc'} fontSize={layout.right.fontSize} fontWeight={layout.right.weight}>{layout.right.glyph}</text>
                </g>

                <g filter={active === 'bottom' ? 'url(#glow)' : undefined}>
                    <circle cx={CX + BX} cy={178 + BY} r={'15'} fill={active === 'bottom' ? '#9b7fff' : '#7b5bf5'} stroke={'#9b7fff'} strokeWidth={'1.5'} />
                    <text x={CX + BX} y={183 + BY} textAnchor={'middle'} fill={'#fff'} fontSize={layout.bottom.fontSize} fontWeight={layout.bottom.weight}>{layout.bottom.glyph}</text>
                </g>

                <g filter={active === 'left' ? 'url(#glow)' : undefined}>
                    <circle cx={CX + BX - 30} cy={148 + BY} r={'15'} fill={'#1e1a35'} stroke={glow('left') || '#5848a0'} strokeWidth={'1.5'} />
                    <text x={CX + BX - 30} y={153 + BY} textAnchor={'middle'} fill={active === 'left' ? '#fff' : '#a89ecc'} fontSize={layout.left.fontSize} fontWeight={layout.left.weight}>{layout.left.glyph}</text>
                </g>
                <rect x={dpadPos.cx - 12} y={dpadPos.cy - 29} rx={'3'} ry={'3'} width={'24'} height={'58'} fill={'#1e1a35'} stroke={'#3d3660'} strokeWidth={'1'} opacity={'0.4'} />
                <rect x={dpadPos.cx - 29} y={dpadPos.cy - 12} rx={'3'} ry={'3'} width={'58'} height={'24'} fill={'#1e1a35'} stroke={'#3d3660'} strokeWidth={'1'} opacity={'0.4'} />

                <g filter={active?.startsWith('stick-') ? 'url(#glow)' : undefined}>
                    <circle cx={lstickPos.cx} cy={lstickPos.cy} r={'26'} fill={'#1a1530'} stroke={active?.startsWith('stick-') ? '#7b5bf5' : '#3d3660'} strokeWidth={'2'} />
                    <circle cx={lstickPos.cx} cy={lstickPos.cy} r={'17'} fill={'#252040'} stroke={'#4a4075'} strokeWidth={'1.5'} />
                    <text x={lstickPos.cx} y={lstickPos.cy - 8} textAnchor={'middle'} fill={active === 'stick-up' ? '#fff' : '#7b5bf5'} fontSize={'9'} fontWeight={active === 'stick-up' ? '700' : '400'}>↑</text>
                    <text x={lstickPos.cx} y={lstickPos.cy + 13} textAnchor={'middle'} fill={active === 'stick-down' ? '#fff' : '#7b5bf5'} fontSize={'9'} fontWeight={active === 'stick-down' ? '700' : '400'}>↓</text>
                    <text x={lstickPos.cx - 11} y={lstickPos.cy + 4} textAnchor={'middle'} fill={active === 'stick-left' ? '#fff' : '#7b5bf5'} fontSize={'9'} fontWeight={active === 'stick-left' ? '700' : '400'}>←</text>
                    <text x={lstickPos.cx + 11} y={lstickPos.cy + 4} textAnchor={'middle'} fill={active === 'stick-right' ? '#fff' : '#7b5bf5'} fontSize={'9'} fontWeight={active === 'stick-right' ? '700' : '400'}>→</text>
                </g>

                <g filter={active?.startsWith('rstick-') ? 'url(#glow)' : undefined}>
                    <circle cx={CX + STX} cy={240 + BY} r={'26'} fill={'#1a1530'} stroke={active?.startsWith('rstick-') ? '#7b5bf5' : '#3d3660'} strokeWidth={'2'} />
                    <circle cx={CX + STX} cy={240 + BY} r={'17'} fill={'#252040'} stroke={'#4a4075'} strokeWidth={'1.5'} />
                    <text x={CX + STX} y={232 + BY} textAnchor={'middle'} fill={active === 'rstick-up' ? '#fff' : '#5848a0'} fontSize={'9'} fontWeight={active === 'rstick-up' ? '700' : '400'}>{ARROW.UP}</text>
                    <text x={CX + STX} y={253 + BY} textAnchor={'middle'} fill={active === 'rstick-down' ? '#fff' : '#5848a0'} fontSize={'9'} fontWeight={active === 'rstick-down' ? '700' : '400'}>{ARROW.DOWN}</text>
                    <text x={CX + STX - 11} y={244 + BY} textAnchor={'middle'} fill={active === 'rstick-left' ? '#fff' : '#5848a0'} fontSize={'9'} fontWeight={active === 'rstick-left' ? '700' : '400'}>{ARROW.LEFT}</text>
                    <text x={CX + STX + 11} y={244 + BY} textAnchor={'middle'} fill={active === 'rstick-right' ? '#fff' : '#5848a0'} fontSize={'9'} fontWeight={active === 'rstick-right' ? '700' : '400'}>{ARROW.RIGHT}</text>
                </g>

            </g>

            <g className={styles['anim-lines']}>
                <line x1={CX - SX - 40} y1={'74'} x2={'85'} y2={'48'} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'85'} cy={'48'} r={'2'} fill={'#5848a0'} />
                <line x1={navLine.x1} y1={navLine.y1} x2={'85'} y2={168} stroke={'#7b5bf5'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'85'} cy={168} r={'2'} fill={'#7b5bf5'} />
                <line x1={CX + BX - 44} y1={148 + BY} x2={'85'} y2={248} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.35'} />
                <circle cx={'85'} cy={248} r={'2'} fill={'#5848a0'} />
                <line x1={CX + SX + 40} y1={'74'} x2={'715'} y2={'48'} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'715'} cy={'48'} r={'2'} fill={'#5848a0'} />
                <line x1={CX + BX + 13} y1={112 + BY} x2={'715'} y2={108} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'715'} cy={108} r={'2'} fill={'#5848a0'} />
                <line x1={CX + BX + 43} y1={142 + BY} x2={'715'} y2={148} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'715'} cy={148} r={'2'} fill={'#5848a0'} />
                <line x1={CX + BX + 13} y1={184 + BY} x2={'715'} y2={208} stroke={'#7b5bf5'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'715'} cy={208} r={'2'} fill={'#7b5bf5'} />
                <line x1={CX + STX + 24} y1={234 + BY} x2={'715'} y2={268} stroke={'#5848a0'} strokeWidth={'1'} opacity={'0.4'} />
                <circle cx={'715'} cy={268} r={'2'} fill={'#5848a0'} />
            </g>

            <g className={styles['anim-labels']}>
                <text x={'80'} y={'44'} textAnchor={'end'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_PREV_TAB')}</text>
                <text x={'80'} y={164} textAnchor={'end'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_NAVIGATE')}</text>
                <text x={'80'} y={244} textAnchor={'end'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_GUIDE')}</text>
                <text x={'80'} y={259} textAnchor={'end'} fill={'#8b7faa'} fontSize={'10'}>{t('GAMEPAD_LABEL_PLAY_PAUSE_PLAYER')}</text>
                <text x={'720'} y={'44'} textAnchor={'start'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_NEXT_TAB')}</text>
                <text x={'720'} y={104} textAnchor={'start'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_FULLSCREEN')}</text>
                <text x={'720'} y={144} textAnchor={'start'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_BACK')}</text>
                <text x={'720'} y={204} textAnchor={'start'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_ACTION_SELECT')}</text>
                <text x={'720'} y={264} textAnchor={'start'} fill={'#c4b5fd'} fontSize={'12'} fontWeight={'500'}>{t('GAMEPAD_LABEL_SEEK_VOL')}</text>
                <text x={CX} y={'475'} textAnchor={'middle'} fill={'#5848a0'} fontSize={'11'}>{t('GAMEPAD_LABEL_COMPAT')}</text>
            </g>
        </svg>
    );
};

export default GamepadDiagram;

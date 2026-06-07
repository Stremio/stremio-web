// Copyright (C) 2017-2026 Smart code 203358507
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useToast from 'stremio/common/Toast/useToast';
import GamepadContext from './GamepadContext';
import type { ControllerType } from './GamepadContext';

type GamepadEventHandlers = Map<string, Map<string, (data?: string) => void>>;
type Direction = 'left' | 'right' | 'up' | 'down';
type BumperButton = 'buttonLB' | 'buttonRB';

type DirectionRuntime = {
    active: boolean;
    nextRepeatAt: number;
};

type ButtonRepeatRuntime = {
    active: boolean;
    repeatCount: number;
    nextRepeatAt: number;
};

type DeviceRuntimeState = {
    lastButtons: boolean[];
    dpadDirections: Record<Direction, DirectionRuntime>;
    leftDirections: Record<Direction, DirectionRuntime>;
    rightDirections: Record<Direction, DirectionRuntime>;
    bumperRepeats: Record<BumperButton, ButtonRepeatRuntime>;
};

type GamepadProviderProps = {
    enabled: boolean;
    onGuide?: () => void;
    children: React.ReactNode;
};

const STANDARD_BUTTONS = {
    buttonA: 0,
    buttonB: 1,
    buttonX: 2,
    buttonY: 3,
    buttonLB: 4,
    buttonRB: 5,
    buttonLTrigger: 6,
    buttonRTrigger: 7,
    buttonBack: 8,
    buttonStart: 9,
    buttonLStick: 10,
    buttonRStick: 11,
    dpadUp: 12,
    dpadDown: 13,
    dpadLeft: 14,
    dpadRight: 15,
    buttonGuide: 16,
} as const;

const BUTTON_ALIASES: Partial<Record<keyof typeof STANDARD_BUTTONS, string[]>> = {
    // Preserve the legacy names while consumers migrate to the correct bumper names.
    buttonLB: ['buttonLT'],
    buttonRB: ['buttonRT'],
};

const DPAD_DIRECTION: Partial<Record<keyof typeof STANDARD_BUTTONS, Direction>> = {
    dpadUp: 'up',
    dpadDown: 'down',
    dpadLeft: 'left',
    dpadRight: 'right',
};

const BUMPER_REPEAT_EVENTS: Record<BumperButton, string> = {
    buttonLB: 'buttonLBRepeat',
    buttonRB: 'buttonRBRepeat',
};

const NAV_ENGAGE_THRESHOLD = 0.55;
const NAV_RELEASE_THRESHOLD = 0.35;
const PLAYER_ENGAGE_THRESHOLD = 0.35;
const PLAYER_RELEASE_THRESHOLD = 0.2;
const DPAD_INITIAL_REPEAT_DELAY = 280;
const DPAD_REPEAT_INTERVAL = 110;
const STICK_INITIAL_REPEAT_DELAY = 460;
const STICK_REPEAT_INTERVAL = 210;
const BUMPER_INITIAL_REPEAT_DELAY = 440;
const BUMPER_REPEAT_INTERVAL_START = 360;
const BUMPER_REPEAT_INTERVAL_MIN = 125;
const BUMPER_REPEAT_ACCELERATION_STEP = 24;

const makeDirectionRuntime = (): Record<Direction, DirectionRuntime> => ({
    left: { active: false, nextRepeatAt: 0 },
    right: { active: false, nextRepeatAt: 0 },
    up: { active: false, nextRepeatAt: 0 },
    down: { active: false, nextRepeatAt: 0 },
});

const makeBumperRepeatRuntime = (): Record<BumperButton, ButtonRepeatRuntime> => ({
    buttonLB: { active: false, repeatCount: 0, nextRepeatAt: 0 },
    buttonRB: { active: false, repeatCount: 0, nextRepeatAt: 0 },
});

const makeRuntime = (): DeviceRuntimeState => ({
    lastButtons: [],
    dpadDirections: makeDirectionRuntime(),
    leftDirections: makeDirectionRuntime(),
    rightDirections: makeDirectionRuntime(),
    bumperRepeats: makeBumperRepeatRuntime(),
});

const detectControllerType = (gamepad: Gamepad): ControllerType => {
    const id = gamepad.id.toLowerCase();
    // Sony vendor id 054c — DualShock / DualSense / generic PlayStation
    if (/sony|playstation|dualsense|dualshock|054c/.test(id)) return 'playstation';
    // Microsoft vendor id 045e — Xbox / XInput
    if (/xbox|microsoft|xinput|045e/.test(id)) return 'xbox';
    // Browser "Standard Gamepad" mapping mirrors the Xbox layout
    if (gamepad.mapping === 'standard') return 'xbox';
    return 'generic';
};

const isPressed = (gamepad: Gamepad, index: number): boolean => {
    const button = gamepad.buttons[index];
    return Boolean(button && (button.pressed || button.value > 0.5));
};

const GamepadProvider = ({ enabled, onGuide, children }: GamepadProviderProps) => {
    const { t } = useTranslation();
    const toast = useToast();
    const eventHandlers = useRef<GamepadEventHandlers>(new Map());
    const lockPrefix = useRef<string | null>(null);
    const runtimeByIndex = useRef<Map<number, DeviceRuntimeState>>(new Map());
    const activeGamepadIndex = useRef<number | null>(null);
    const [controllerType, setControllerType] = useState<ControllerType>('generic');
    const lastActivityNotificationAt = useRef(0);

    const on = useCallback((event: string, id: string, callback: (data?: string) => void) => {
        if (!eventHandlers.current.has(event)) {
            eventHandlers.current.set(event, new Map());
        }
        eventHandlers.current.get(event)!.set(id, callback);
    }, []);

    const off = useCallback((event: string, id: string) => {
        const handlersMap = eventHandlers.current.get(event);
        handlersMap?.delete(id);
        if (handlersMap?.size === 0) {
            eventHandlers.current.delete(event);
        }
    }, []);

    const lock = useCallback((prefix: string) => {
        lockPrefix.current = prefix;
    }, []);

    const unlock = useCallback(() => {
        lockPrefix.current = null;
    }, []);

    const emit = useCallback((event: string, data?: string) => {
        const handlersMap = eventHandlers.current.get(event);
        if (!handlersMap || handlersMap.size === 0) return;

        if (lockPrefix.current) {
            const matching = Array.from(handlersMap.entries())
                .filter(([id]) => id.startsWith(lockPrefix.current!));
            if (matching.length > 0) {
                matching[matching.length - 1][1](data);
            }
            return;
        }

        const latestHandler = Array.from(handlersMap.values()).slice(-1)[0];
        latestHandler?.(data);
    }, []);

    const notifyActivity = useCallback(() => {
        const now = Date.now();
        if (now - lastActivityNotificationAt.current < 80) return;
        lastActivityNotificationAt.current = now;
        window.dispatchEvent(new CustomEvent('stremio-gamepad-activity'));
    }, []);

    const markActive = useCallback((gamepad: Gamepad) => {
        notifyActivity();
        if (activeGamepadIndex.current !== gamepad.index) {
            activeGamepadIndex.current = gamepad.index;
            setControllerType(detectControllerType(gamepad));
        }
    }, [notifyActivity]);

    const onGamepadConnected = useCallback((e: GamepadEvent) => {
        runtimeByIndex.current.set(e.gamepad.index, makeRuntime());
        if (activeGamepadIndex.current === null) {
            markActive(e.gamepad);
        }
        // @ts-expect-error show() expects no arguments
        toast.show({ type: 'info', title: t('GAMEPAD_CONNECTED'), timeout: 4000 });
    }, [markActive, toast, t]);

    const onGamepadDisconnected = useCallback((e: GamepadEvent) => {
        runtimeByIndex.current.delete(e.gamepad.index);
        if (activeGamepadIndex.current === e.gamepad.index) {
            const remaining = Array.from(navigator.getGamepads()).filter((gp) => gp !== null) as Gamepad[];
            activeGamepadIndex.current = remaining[0]?.index ?? null;
            setControllerType(remaining[0] ? detectControllerType(remaining[0]) : 'generic');
        }
        // @ts-expect-error show() expects no arguments
        toast.show({ type: 'info', title: t('GAMEPAD_DISCONNECTED'), timeout: 4000 });
    }, [toast, t]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof navigator.getGamepads === 'function') {
            const existing = Array.from(navigator.getGamepads()).filter((gp) => gp !== null) as Gamepad[];
            existing.forEach((gamepad) => runtimeByIndex.current.set(gamepad.index, makeRuntime()));
            if (existing.length > 0) markActive(existing[0]);
        }
        window.addEventListener('gamepadconnected', onGamepadConnected);
        window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
        return () => {
            window.removeEventListener('gamepadconnected', onGamepadConnected);
            window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
            runtimeByIndex.current.clear();
            activeGamepadIndex.current = null;
        };
    }, [enabled, markActive, onGamepadConnected, onGamepadDisconnected]);

    useEffect(() => {
        if (onGuide) {
            // Preserve the existing face-left guide shortcut and support the standard guide button when exposed.
            on('buttonX', 'guide', onGuide);
            on('buttonGuide', 'guide-standard', onGuide);
        }
        return () => {
            off('buttonX', 'guide');
            off('buttonGuide', 'guide-standard');
        };
    }, [off, on, onGuide]);

    useEffect(() => {
        if (!enabled || typeof navigator.getGamepads !== 'function') return;
        let animationFrameId: number;

        const emitDirection = (
            runtime: Record<Direction, DirectionRuntime>,
            direction: Direction,
            pressed: boolean,
            currentTime: number,
            event: 'analog' | 'analogRight',
            initialRepeatDelay = DPAD_INITIAL_REPEAT_DELAY,
            repeatInterval = DPAD_REPEAT_INTERVAL,
        ) => {
            const state = runtime[direction];
            if (!pressed) {
                state.active = false;
                state.nextRepeatAt = 0;
                return;
            }
            if (!state.active) {
                state.active = true;
                state.nextRepeatAt = currentTime + initialRepeatDelay;
                emit(event, direction);
                return;
            }
            if (currentTime >= state.nextRepeatAt) {
                state.nextRepeatAt = currentTime + repeatInterval;
                emit(event, direction);
            }
        };

        const processButtonEdges = (controller: Gamepad, runtime: DeviceRuntimeState, currentTime: number) => {
            (Object.entries(STANDARD_BUTTONS) as [keyof typeof STANDARD_BUTTONS, number][]).forEach(([name, index]) => {
                const pressed = isPressed(controller, index);
                const previous = runtime.lastButtons[index] ?? false;
                if (pressed && !previous) {
                    markActive(controller);
                    emit(name);
                    BUTTON_ALIASES[name]?.forEach((alias) => emit(alias));
                }
                if (!pressed && previous) {
                    emit(`${name}Up`);
                    BUTTON_ALIASES[name]?.forEach((alias) => emit(`${alias}Up`));
                }
                runtime.lastButtons[index] = pressed;
            });

            // D-pad is digital navigation with deliberate repeat. It is also exposed as dedicated events.
            (Object.entries(DPAD_DIRECTION) as [keyof typeof STANDARD_BUTTONS, Direction][]).forEach(([name, direction]) => {
                const pressed = isPressed(controller, STANDARD_BUTTONS[name]);
                if (pressed) markActive(controller);
                emitDirection(runtime.dpadDirections, direction, pressed, currentTime, 'analog');
            });
        };

        const processBumperRepeats = (controller: Gamepad, runtime: DeviceRuntimeState, currentTime: number) => {
            (['buttonLB', 'buttonRB'] as BumperButton[]).forEach((name) => {
                const pressed = isPressed(controller, STANDARD_BUTTONS[name]);
                const state = runtime.bumperRepeats[name];
                if (!pressed) {
                    state.active = false;
                    state.repeatCount = 0;
                    state.nextRepeatAt = 0;
                    return;
                }
                if (!state.active) {
                    state.active = true;
                    state.repeatCount = 0;
                    state.nextRepeatAt = currentTime + BUMPER_INITIAL_REPEAT_DELAY;
                    return;
                }
                if (currentTime < state.nextRepeatAt) return;
                emit(BUMPER_REPEAT_EVENTS[name]);
                state.repeatCount += 1;
                const interval = Math.max(
                    BUMPER_REPEAT_INTERVAL_MIN,
                    BUMPER_REPEAT_INTERVAL_START - state.repeatCount * BUMPER_REPEAT_ACCELERATION_STEP,
                );
                state.nextRepeatAt = currentTime + interval;
            });
        };

        const processAxes = (controller: Gamepad, runtime: DeviceRuntimeState, currentTime: number) => {
            const leftX = controller.axes[0] ?? 0;
            const leftY = controller.axes[1] ?? 0;
            const rightX = controller.axes[2] ?? 0;
            const rightY = controller.axes[3] ?? 0;

            const leftActive = Math.abs(leftX) >= NAV_ENGAGE_THRESHOLD || Math.abs(leftY) >= NAV_ENGAGE_THRESHOLD;
            const rightActive = Math.abs(rightX) >= PLAYER_ENGAGE_THRESHOLD || Math.abs(rightY) >= PLAYER_ENGAGE_THRESHOLD;
            if (leftActive || rightActive) markActive(controller);

            // D-pad and left stick keep independent repeat state. Sharing the same latch would reset the
            // held stick every frame when no D-pad button is pressed, causing one event per animation frame.
            const dpadHeld = [12, 13, 14, 15].some((index) => isPressed(controller, index));
            const horizontalDominant = Math.abs(leftX) >= Math.abs(leftY);
            const leftPressed = !dpadHeld && horizontalDominant
                && (leftX <= -NAV_ENGAGE_THRESHOLD || (runtime.leftDirections.left.active && leftX <= -NAV_RELEASE_THRESHOLD));
            const rightPressed = !dpadHeld && horizontalDominant
                && (leftX >= NAV_ENGAGE_THRESHOLD || (runtime.leftDirections.right.active && leftX >= NAV_RELEASE_THRESHOLD));
            const upPressed = !dpadHeld && !horizontalDominant
                && (leftY <= -NAV_ENGAGE_THRESHOLD || (runtime.leftDirections.up.active && leftY <= -NAV_RELEASE_THRESHOLD));
            const downPressed = !dpadHeld && !horizontalDominant
                && (leftY >= NAV_ENGAGE_THRESHOLD || (runtime.leftDirections.down.active && leftY >= NAV_RELEASE_THRESHOLD));
            emitDirection(runtime.leftDirections, 'left', leftPressed, currentTime, 'analog', STICK_INITIAL_REPEAT_DELAY, STICK_REPEAT_INTERVAL);
            emitDirection(runtime.leftDirections, 'right', rightPressed, currentTime, 'analog', STICK_INITIAL_REPEAT_DELAY, STICK_REPEAT_INTERVAL);
            emitDirection(runtime.leftDirections, 'up', upPressed, currentTime, 'analog', STICK_INITIAL_REPEAT_DELAY, STICK_REPEAT_INTERVAL);
            emitDirection(runtime.leftDirections, 'down', downPressed, currentTime, 'analog', STICK_INITIAL_REPEAT_DELAY, STICK_REPEAT_INTERVAL);

            emitDirection(runtime.rightDirections, 'left', rightX <= -PLAYER_ENGAGE_THRESHOLD || (runtime.rightDirections.left.active && rightX <= -PLAYER_RELEASE_THRESHOLD), currentTime, 'analogRight');
            emitDirection(runtime.rightDirections, 'right', rightX >= PLAYER_ENGAGE_THRESHOLD || (runtime.rightDirections.right.active && rightX >= PLAYER_RELEASE_THRESHOLD), currentTime, 'analogRight');
            emitDirection(runtime.rightDirections, 'up', rightY <= -PLAYER_ENGAGE_THRESHOLD || (runtime.rightDirections.up.active && rightY <= -PLAYER_RELEASE_THRESHOLD), currentTime, 'analogRight');
            emitDirection(runtime.rightDirections, 'down', rightY >= PLAYER_ENGAGE_THRESHOLD || (runtime.rightDirections.down.active && rightY >= PLAYER_RELEASE_THRESHOLD), currentTime, 'analogRight');
        };

        const updateStatus = () => {
            if (document.hasFocus()) {
                const currentTime = Date.now();
                const controllers = Array.from(navigator.getGamepads()).filter((gp) => gp !== null) as Gamepad[];
                controllers.forEach((controller) => {
                    let runtime = runtimeByIndex.current.get(controller.index);
                    if (!runtime) {
                        runtime = makeRuntime();
                        runtimeByIndex.current.set(controller.index, runtime);
                        if (activeGamepadIndex.current === null) markActive(controller);
                    }
                    processButtonEdges(controller, runtime, currentTime);
                    if (activeGamepadIndex.current === controller.index) {
                        processBumperRepeats(controller, runtime, currentTime);
                        processAxes(controller, runtime, currentTime);
                    }
                });
            }
            animationFrameId = requestAnimationFrame(updateStatus);
        };

        animationFrameId = requestAnimationFrame(updateStatus);
        return () => cancelAnimationFrame(animationFrameId);
    }, [emit, enabled, markActive]);

    return (
        <GamepadContext.Provider value={{ on, off, lock, unlock, controllerType }}>
            {children}
        </GamepadContext.Provider>
    );
};

export default GamepadProvider;

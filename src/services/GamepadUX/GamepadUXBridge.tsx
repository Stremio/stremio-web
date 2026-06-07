// Copyright (C) 2017-2026 Smart code 203358507
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useGamepad } from '../GamepadContext';

type Direction = 'left' | 'right' | 'up' | 'down';
type Overlay = 'keyboard' | null;
type KeyboardFocusArea = 'keyboard' | 'suggestions';
type GamepadAvailability = 'connected' | 'waiting' | 'insecure' | 'unsupported';

type KeyboardKey = {
    id: string;
    label: string;
    value?: string;
    action?: 'space' | 'backspace' | 'clear' | 'search';
};

type KeyboardCursor = {
    row: number;
    col: number;
};

const STYLE_ID = 'stremio-gamepad-ux-styles';
const HINT_TIMEOUT = 5000;
const PLAYER_HINT_TIMEOUT = 1900;
const CONNECTION_NOTICE_TIMEOUT = 2200;
const SEARCH_INPUT = 'input[type="search"], input[placeholder*="earch" i], input[placeholder*="esquis" i], input[placeholder*="uscar" i]';

const CSS = `
.gamepad-ux-status{position:fixed;right:1rem;bottom:1rem;z-index:10000;display:flex;align-items:center;gap:.46rem;padding:.5rem .72rem;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(15,16,24,.9);box-shadow:0 .35rem 1.2rem rgba(0,0,0,.28);pointer-events:none;font-size:.74rem;color:rgba(255,255,255,.94);animation:gamepad-ux-rise .18s ease-out}.gamepad-ux-status-dot{width:.52rem;height:.52rem;border-radius:50%;background:#67d18b;box-shadow:0 0 .7rem rgba(103,209,139,.65)}.gamepad-ux-hints{position:fixed;left:50%;bottom:1.1rem;z-index:10000;display:flex;align-items:center;gap:.82rem;max-width:min(94vw,68rem);transform:translateX(-50%);padding:.52rem .76rem;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(15,16,24,.88);box-shadow:0 .35rem 1.2rem rgba(0,0,0,.24);pointer-events:none;font-size:.75rem;color:rgba(255,255,255,.9);opacity:0;transition:opacity .16s ease,transform .16s ease}.gamepad-ux-hints.player{bottom:clamp(11rem,20vh,14rem);background:rgba(15,16,24,.78)}.gamepad-ux-hints.visible{opacity:1;transform:translateX(-50%) translateY(-.1rem)}.gamepad-ux-hint{display:flex;align-items:center;gap:.3rem;white-space:nowrap}.gamepad-ux-glyph{display:inline-flex;align-items:center;justify-content:center;min-width:1.28rem;height:1.28rem;padding:0 .22rem;border:1px solid rgba(255,255,255,.42);border-radius:999px;background:rgba(255,255,255,.08);font-weight:700;font-size:.64rem;color:#fff}.gamepad-ux-keyboard-dock{position:fixed;left:0;right:0;bottom:0;z-index:10001;box-sizing:border-box;padding:.74rem 1rem .86rem;border-top:1px solid rgba(255,255,255,.14);background:rgba(17,19,29,.985);box-shadow:0 -.7rem 2.2rem rgba(0,0,0,.38);color:#fff}.gamepad-ux-keyboard-panel{width:min(72rem,100%);margin:0 auto}.gamepad-ux-keyboard-header{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:.52rem}.gamepad-ux-title{margin:0 0 .2rem;font-size:1.28rem;letter-spacing:-.02em}.gamepad-ux-subtitle{margin:0;color:rgba(255,255,255,.68);font-size:.82rem}.gamepad-ux-search-preview{display:flex;align-items:center;min-height:2.7rem;box-sizing:border-box;margin-bottom:.56rem;padding:.58rem .82rem;border:1px solid rgba(255,255,255,.2);border-radius:.58rem;background:rgba(255,255,255,.07);color:#fff;font-size:1.04rem;line-height:1.35;white-space:pre-wrap;overflow-wrap:anywhere}.gamepad-ux-search-preview.empty{color:rgba(255,255,255,.4)}.gamepad-ux-visible-space{display:inline-block;min-width:.34em}.gamepad-ux-caret{display:inline-block;width:.1rem;height:1.2rem;margin:0 .06rem;background:rgba(255,255,255,.95);animation:gamepad-ux-blink 1s step-end infinite}.gamepad-ux-key-row{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:.42rem;margin-top:.42rem}.gamepad-ux-key{min-height:2.72rem;padding:.28rem .18rem;border:1px solid rgba(255,255,255,.14);border-radius:.56rem;background:rgba(255,255,255,.065);color:#fff;font:inherit;font-size:.86rem;cursor:pointer;transition:border-color .12s ease,background .12s ease,box-shadow .12s ease}.gamepad-ux-key:hover{background:rgba(255,255,255,.11)}.gamepad-ux-key:focus{outline:none}.gamepad-ux-key.selected{border-color:rgba(255,255,255,.96);background:rgba(129,101,255,.34);box-shadow:inset 0 0 0 2px rgba(255,255,255,.98),inset 0 0 0 4px rgba(129,101,255,.58)}.gamepad-ux-footer{display:flex;flex-wrap:wrap;gap:.62rem .9rem;margin-top:.66rem;color:rgba(255,255,255,.72);font-size:.74rem}.gamepad-ux-footer span{display:flex;align-items:center;gap:.28rem}.gamepad-ux-suggestion-selected{outline:2px solid rgba(255,255,255,.98)!important;outline-offset:-2px!important;box-shadow:inset 0 0 0 4px rgba(129,101,255,.58)!important;background:rgba(129,101,255,.25)!important;border-radius:.34rem!important}@keyframes gamepad-ux-rise{from{opacity:0;transform:translateY(.35rem)}to{opacity:1;transform:translateY(0)}}@keyframes gamepad-ux-blink{0%,48%{opacity:1}49%,100%{opacity:0}}
`;

const makeLetterKeys = (characters: string): KeyboardKey[] => characters
    .split('')
    .map((value) => ({ id: `char-${value}`, label: value, value }));

const KEY_ROWS: KeyboardKey[][] = [
    makeLetterKeys('QWERTYUIOP'),
    [
        ...makeLetterKeys('ASDFGHJKL'),
        { id: 'backspace', label: 'Apagar', action: 'backspace' },
    ],
    [
        ...makeLetterKeys('ZXCVBNM'),
        { id: 'space', label: 'Espaço', action: 'space' },
        { id: 'clear', label: 'Limpar', action: 'clear' },
        { id: 'search', label: 'Pesquisar', action: 'search' },
    ],
    makeLetterKeys('1234567890'),
];

const isPlayerRoute = () => /#\/player(?:\/|\?|$)/i.test(window.location.hash);

const findSearchInput = () => document.querySelector<HTMLInputElement>(SEARCH_INPUT);

const isVisible = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
};

const getVisibleSearchSuggestions = (): HTMLElement[] => {
    const input = findSearchInput();
    if (!input) return [];

    const inputRect = input.getBoundingClientRect();
    const keyboardDock = document.querySelector<HTMLElement>('.gamepad-ux-keyboard-dock');
    const dockTop = keyboardDock?.getBoundingClientRect().top ?? window.innerHeight;
    const candidates = Array.from(document.querySelectorAll<HTMLElement>('a,button,[role="button"],[role="option"],[tabindex]'));

    return candidates
        .filter((element) => {
            if (!isVisible(element)) return false;
            if (element.closest('.gamepad-ux-keyboard-dock')) return false;
            if (element === input || element.contains(input)) return false;
            if (element.matches('[tabindex="-1"]')) return false;

            const text = (element.textContent ?? '').trim();
            if (!text || /clear history|limpar hist[oó]rico/i.test(text)) return false;

            const rect = element.getBoundingClientRect();
            const horizontallyNear = rect.right >= inputRect.left - 24 && rect.left <= inputRect.right + 24;
            const verticallyBetween = rect.top >= inputRect.bottom - 4 && rect.bottom <= dockTop - 8;
            return horizontallyNear && verticallyBetween;
        })
        .filter((element, _, all) => !all.some((candidate) => candidate !== element && element.contains(candidate)))
        .sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top || rectA.left - rectB.left;
        });
};

const setNativeInputValue = (input: HTMLInputElement, value: string, caret?: number) => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    descriptor?.set?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (typeof caret === 'number') input.setSelectionRange(caret, caret);
};

const glyphsFor = (type: string) => type === 'playstation'
    ? { select: '✕', back: '○', episodes: '□', menu: 'OPT', search: 'SHR', delete: '□', space: '△', cursor: 'L1/R1', tab: 'L1/R1', previous: 'L1', next: 'R1' }
    : { select: 'A', back: 'B', episodes: 'X', menu: 'MENU', search: 'VIEW', delete: 'X', space: 'Y', cursor: 'LB/RB', tab: 'LB/RB', previous: 'LB', next: 'RB' };

const getKey = (cursor: KeyboardCursor) => KEY_ROWS[cursor.row]?.[cursor.col];

const renderPreviewSegment = (segment: string, prefix: string) => segment.split('').map((character, index) => character === ' '
    ? <span className="gamepad-ux-visible-space" key={`${prefix}-space-${index}`}>{'\u00A0'}</span>
    : <React.Fragment key={`${prefix}-char-${index}`}>{character}</React.Fragment>);

const GamepadUXBridge = () => {
    const gamepad = useGamepad();
    const [overlay, setOverlay] = useState<Overlay>(null);
    const [hintsVisible, setHintsVisible] = useState(false);
    const [connectionNoticeVisible, setConnectionNoticeVisible] = useState(false);
    const [keyboardValue, setKeyboardValue] = useState('');
    const [keyboardCaret, setKeyboardCaret] = useState(0);
    const [keyboardCursor, setKeyboardCursor] = useState<KeyboardCursor>({ row: 0, col: 0 });
    const [keyboardFocusArea, setKeyboardFocusArea] = useState<KeyboardFocusArea>('keyboard');
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [availability, setAvailability] = useState<GamepadAvailability>('waiting');
    const [routeHash, setRouteHash] = useState(window.location.hash);
    const keyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const hintTimer = useRef<number | null>(null);
    const connectionNoticeTimer = useRef<number | null>(null);
    const glyphs = useMemo(() => glyphsFor(gamepad?.controllerType ?? 'generic'), [gamepad?.controllerType]);
    const playerRoute = /#\/player(?:\/|\?|$)/i.test(routeHash);

    const closeOverlay = useCallback(() => setOverlay(null), []);

    const focusKeyboard = useCallback((cursor: KeyboardCursor) => {
        const key = getKey(cursor);
        if (!key) return;
        requestAnimationFrame(() => keyRefs.current[key.id]?.focus());
    }, []);

    const syncSearchValue = useCallback((value: string, caret: number) => {
        setKeyboardValue(value);
        setKeyboardCaret(caret);
        const input = findSearchInput();
        if (input) setNativeInputValue(input, value, caret);
    }, []);

    const insertText = useCallback((text: string) => {
        const value = `${keyboardValue.slice(0, keyboardCaret)}${text}${keyboardValue.slice(keyboardCaret)}`;
        syncSearchValue(value, keyboardCaret + text.length);
    }, [keyboardCaret, keyboardValue, syncSearchValue]);

    const deleteCharacter = useCallback(() => {
        if (keyboardCaret <= 0) return;
        const value = `${keyboardValue.slice(0, keyboardCaret - 1)}${keyboardValue.slice(keyboardCaret)}`;
        syncSearchValue(value, keyboardCaret - 1);
    }, [keyboardCaret, keyboardValue, syncSearchValue]);

    const moveTextCaret = useCallback((offset: number) => {
        const caret = Math.max(0, Math.min(keyboardValue.length, keyboardCaret + offset));
        setKeyboardCaret(caret);
        findSearchInput()?.setSelectionRange(caret, caret);
    }, [keyboardCaret, keyboardValue.length]);

    const openKeyboard = useCallback(() => {
        if (isPlayerRoute()) return;
        window.location.hash = '#/search';
        window.setTimeout(() => {
            const input = findSearchInput();
            input?.focus();
            const value = input?.value ?? '';
            setKeyboardValue(value);
            setKeyboardCaret(value.length);
            setKeyboardCursor({ row: 0, col: 0 });
            setKeyboardFocusArea('keyboard');
            setSuggestionIndex(0);
            setOverlay('keyboard');
        }, 100);
    }, []);

    const submitSearch = useCallback(() => {
        const input = findSearchInput();
        if (input) {
            input.focus();
            setNativeInputValue(input, keyboardValue, keyboardCaret);
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        }
        closeOverlay();
    }, [closeOverlay, keyboardCaret, keyboardValue]);

    const chooseSuggestion = useCallback(() => {
        const suggestions = getVisibleSearchSuggestions();
        const target = suggestions[suggestionIndex];
        if (!target) return;
        target.click();
        window.setTimeout(() => {
            const input = findSearchInput();
            const value = input?.value ?? keyboardValue;
            setKeyboardValue(value);
            setKeyboardCaret(input?.selectionStart ?? value.length);
            setKeyboardFocusArea('keyboard');
        }, 50);
    }, [keyboardValue, suggestionIndex]);

    const applyKey = useCallback((key: KeyboardKey) => {
        if (key.value) return insertText(key.value.toLowerCase());
        if (key.action === 'space') return insertText(' ');
        if (key.action === 'backspace') return deleteCharacter();
        if (key.action === 'clear') return syncSearchValue('', 0);
        if (key.action === 'search') return submitSearch();
    }, [deleteCharacter, insertText, submitSearch, syncSearchValue]);

    const moveKeyboard = useCallback((direction: Direction) => {
        if (keyboardFocusArea === 'suggestions') {
            const suggestions = getVisibleSearchSuggestions();
            if (!suggestions.length) {
                setKeyboardFocusArea('keyboard');
                return;
            }
            if (direction === 'up') {
                setSuggestionIndex((index) => Math.max(0, index - 1));
                return;
            }
            if (direction === 'down') {
                if (suggestionIndex >= suggestions.length - 1) {
                    setKeyboardFocusArea('keyboard');
                    return;
                }
                setSuggestionIndex((index) => Math.min(suggestions.length - 1, index + 1));
            }
            return;
        }

        if (direction === 'up' && keyboardCursor.row === 0) {
            const suggestions = getVisibleSearchSuggestions();
            if (suggestions.length) {
                setSuggestionIndex(0);
                setKeyboardFocusArea('suggestions');
                return;
            }
        }

        setKeyboardCursor((cursor) => {
            if (direction === 'left') return { row: cursor.row, col: Math.max(0, cursor.col - 1) };
            if (direction === 'right') return { row: cursor.row, col: Math.min(KEY_ROWS[cursor.row].length - 1, cursor.col + 1) };
            const targetRow = direction === 'up'
                ? Math.max(0, cursor.row - 1)
                : Math.min(KEY_ROWS.length - 1, cursor.row + 1);
            if (targetRow === cursor.row) return cursor;
            return { row: targetRow, col: cursor.col };
        });
    }, [keyboardCursor.row, keyboardFocusArea, suggestionIndex]);

    useEffect(() => {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    useEffect(() => {
        const onHashChange = () => setRouteHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        const updateAvailability = () => {
            if (!window.isSecureContext) {
                setAvailability('insecure');
                return;
            }
            if (typeof navigator.getGamepads !== 'function') {
                setAvailability('unsupported');
                return;
            }
            const connected = Array.from(navigator.getGamepads()).some((candidate) => candidate !== null);
            setAvailability(connected ? 'connected' : 'waiting');
        };
        updateAvailability();
        const timer = window.setInterval(updateAvailability, 750);
        window.addEventListener('gamepadconnected', updateAvailability);
        window.addEventListener('gamepaddisconnected', updateAvailability);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('gamepadconnected', updateAvailability);
            window.removeEventListener('gamepaddisconnected', updateAvailability);
        };
    }, []);

    useEffect(() => {
        if (availability !== 'connected') {
            setConnectionNoticeVisible(false);
            setHintsVisible(false);
            closeOverlay();
            return;
        }
        setConnectionNoticeVisible(true);
        if (connectionNoticeTimer.current) window.clearTimeout(connectionNoticeTimer.current);
        connectionNoticeTimer.current = window.setTimeout(() => setConnectionNoticeVisible(false), CONNECTION_NOTICE_TIMEOUT);
        return () => {
            if (connectionNoticeTimer.current) window.clearTimeout(connectionNoticeTimer.current);
        };
    }, [availability, closeOverlay]);

    useEffect(() => {
        const onActivity = () => {
            if (availability !== 'connected') return;
            setHintsVisible(true);
            if (hintTimer.current) window.clearTimeout(hintTimer.current);
            hintTimer.current = window.setTimeout(() => setHintsVisible(false), playerRoute ? PLAYER_HINT_TIMEOUT : HINT_TIMEOUT);
        };
        const onOtherInput = () => setHintsVisible(false);
        window.addEventListener('stremio-gamepad-activity', onActivity);
        window.addEventListener('mousemove', onOtherInput);
        window.addEventListener('keydown', onOtherInput);
        return () => {
            window.removeEventListener('stremio-gamepad-activity', onActivity);
            window.removeEventListener('mousemove', onOtherInput);
            window.removeEventListener('keydown', onOtherInput);
            if (hintTimer.current) window.clearTimeout(hintTimer.current);
        };
    }, [availability, playerRoute]);

    useEffect(() => {
        if (!gamepad || availability !== 'connected') return;
        const globalId = 'gamepad-ux-global';
        gamepad.on('buttonBack', globalId, openKeyboard);
        return () => gamepad.off('buttonBack', globalId);
    }, [availability, gamepad, openKeyboard]);

    useEffect(() => {
        if (!gamepad || availability !== 'connected' || overlay !== 'keyboard') return;
        const id = 'gamepad-ux-overlay';
        gamepad.lock('gamepad-ux');

        const onAnalog = (direction?: string) => direction && moveKeyboard(direction as Direction);
        const onSelect = () => {
            if (keyboardFocusArea === 'suggestions') {
                chooseSuggestion();
                return;
            }
            const key = getKey(keyboardCursor);
            if (key) applyKey(key);
        };
        const onBack = () => {
            if (keyboardFocusArea === 'suggestions') {
                setKeyboardFocusArea('keyboard');
                return;
            }
            closeOverlay();
        };

        gamepad.on('analog', id, onAnalog);
        gamepad.on('buttonA', id, onSelect);
        gamepad.on('buttonB', id, onBack);
        gamepad.on('buttonX', id, deleteCharacter);
        gamepad.on('buttonY', id, () => insertText(' '));
        gamepad.on('buttonLB', id, () => moveTextCaret(-1));
        gamepad.on('buttonRB', id, () => moveTextCaret(1));
        gamepad.on('buttonStart', id, submitSearch);
        return () => {
            gamepad.off('analog', id);
            gamepad.off('buttonA', id);
            gamepad.off('buttonB', id);
            gamepad.off('buttonX', id);
            gamepad.off('buttonY', id);
            gamepad.off('buttonLB', id);
            gamepad.off('buttonRB', id);
            gamepad.off('buttonStart', id);
            gamepad.unlock();
        };
    }, [applyKey, availability, chooseSuggestion, closeOverlay, deleteCharacter, gamepad, insertText, keyboardCursor, keyboardFocusArea, moveKeyboard, moveTextCaret, overlay, submitSearch]);

    useEffect(() => {
        if (overlay === 'keyboard' && keyboardFocusArea === 'keyboard') focusKeyboard(keyboardCursor);
    }, [focusKeyboard, keyboardCursor, keyboardFocusArea, overlay]);

    useLayoutEffect(() => {
        document.querySelectorAll('.gamepad-ux-suggestion-selected')
            .forEach((element) => element.classList.remove('gamepad-ux-suggestion-selected'));
        if (overlay !== 'keyboard' || keyboardFocusArea !== 'suggestions') return;

        const suggestions = getVisibleSearchSuggestions();
        if (!suggestions.length) {
            setKeyboardFocusArea('keyboard');
            return;
        }
        const clampedIndex = Math.min(suggestionIndex, suggestions.length - 1);
        if (clampedIndex !== suggestionIndex) setSuggestionIndex(clampedIndex);
        const target = suggestions[clampedIndex];
        target?.classList.add('gamepad-ux-suggestion-selected');
        target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        return () => target?.classList.remove('gamepad-ux-suggestion-selected');
    }, [keyboardFocusArea, keyboardValue, overlay, suggestionIndex]);

    if (availability !== 'connected') return null;

    return (
        <>
            {connectionNoticeVisible && (
                <div className="gamepad-ux-status" aria-live="polite">
                    <span className="gamepad-ux-status-dot" />
                    <span>Controle conectado</span>
                </div>
            )}
            <div className={`gamepad-ux-hints ${playerRoute ? 'player' : ''} ${hintsVisible && !overlay ? 'visible' : ''}`} aria-hidden="true">
                {playerRoute ? (
                    <>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.select}</b> play / pause</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.episodes}</b> episódios</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.back}</b> sair</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.previous}</b> −15 s</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.next}</b> +15 s</span>
                        <span className="gamepad-ux-hint">D-pad ←→ navegar</span>
                        <span className="gamepad-ux-hint">D-pad ↑↓ volume na barra</span>
                        <span className="gamepad-ux-hint">R-stick ↑↓ volume</span>
                    </>
                ) : (
                    <>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.select}</b> selecionar</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.back}</b> voltar</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.search}</b> pesquisar</span>
                        <span className="gamepad-ux-hint"><b className="gamepad-ux-glyph">{glyphs.tab}</b> abas</span>
                    </>
                )}
            </div>

            {overlay === 'keyboard' && (
                <div className="gamepad-ux-keyboard-dock" data-gamepad-modal="true">
                    <section className="gamepad-ux-keyboard-panel" role="dialog" aria-label="Teclado virtual para pesquisa">
                        <div className="gamepad-ux-keyboard-header">
                            <div>
                                <h2 className="gamepad-ux-title">Pesquisar</h2>
                                <p className="gamepad-ux-subtitle">Os resultados são atualizados enquanto você digita.</p>
                            </div>
                        </div>
                        <output className={`gamepad-ux-search-preview ${keyboardValue ? '' : 'empty'}`}>
                            {keyboardValue
                                ? <>{renderPreviewSegment(keyboardValue.slice(0, keyboardCaret), 'before')}<i className="gamepad-ux-caret" />{renderPreviewSegment(keyboardValue.slice(keyboardCaret), 'after')}</>
                                : <><i className="gamepad-ux-caret" /><span>Digite sua pesquisa</span></>}
                        </output>
                        {KEY_ROWS.map((row, rowIndex) => (
                            <div className="gamepad-ux-key-row" key={`row-${rowIndex}`}>
                                {row.map((key, colIndex) => {
                                    const selected = keyboardFocusArea === 'keyboard' && keyboardCursor.row === rowIndex && keyboardCursor.col === colIndex;
                                    return (
                                        <button
                                            key={key.id}
                                            ref={(element) => { keyRefs.current[key.id] = element; }}
                                            type="button"
                                            tabIndex={selected ? 0 : -1}
                                            className={`gamepad-ux-key ${selected ? 'selected' : ''}`}
                                            onClick={() => applyKey(key)}
                                            onFocus={() => { setKeyboardFocusArea('keyboard'); setKeyboardCursor({ row: rowIndex, col: colIndex }); }}
                                        >
                                            {key.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                        <div className="gamepad-ux-footer">
                            <span><b className="gamepad-ux-glyph">{glyphs.select}</b> selecionar</span>
                            <span><b className="gamepad-ux-glyph">{glyphs.back}</b> fechar</span>
                            <span><b className="gamepad-ux-glyph">{glyphs.delete}</b> apagar</span>
                            <span><b className="gamepad-ux-glyph">{glyphs.space}</b> espaço</span>
                            <span><b className="gamepad-ux-glyph">{glyphs.cursor}</b> mover cursor</span>
                            <span>D-pad ↑ sugestões</span>
                            <span><b className="gamepad-ux-glyph">{glyphs.menu}</b> pesquisar</span>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
};

export default GamepadUXBridge;

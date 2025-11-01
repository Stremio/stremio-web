// Copyright (C) 2017-2023 Smart code 203358507

const { FileDropProvider, onFileDrop } = require('./FileDrop');
const { PlatformProvider, usePlatform } = require('./Platform');
const { ToastProvider, useToast } = require('./Toast');
const { TooltipProvider, Tooltip } = require('./Tooltips');
const { ShortcutsProvider, useShortcuts } = require('./Shortcuts');
const comparatorWithPriorities = require('./comparatorWithPriorities');
const CONSTANTS = require('./CONSTANTS');
const { withCoreSuspender, useCoreSuspender } = require('./CoreSuspender');
const getVisibleChildrenRange = require('./getVisibleChildrenRange');
const interfaceLanguages = require('./interfaceLanguages.json');
const languageNames = require('./languageNames.json');
const languages = require('./languages');
const routesRegexp = require('./routesRegexp');
const useAnimationFrame = require('./useAnimationFrame');
const useBinaryState = require('./useBinaryState');
const { default: useFullscreen } = require('./useFullscreen');
const { default: useInterval } = require('./useInterval');
const useLiveRef = require('./useLiveRef');
const useModelState = require('./useModelState');
const useNotifications = require('./useNotifications');
const useOnScrollToBottom = require('./useOnScrollToBottom');
const useProfile = require('./useProfile');
const { default: useSettings } = require('./useSettings');
const { default: useShell } = require('./useShell');
const useStreamingServer = require('./useStreamingServer');
const { default: useTimeout } = require('./useTimeout');
const useTorrent = require('./useTorrent');
const useTranslate = require('./useTranslate');
const { default: useOrientation } = require('./useOrientation');
const { default: useLanguageSorting } = require('./useLanguageSorting');

module.exports = {
    FileDropProvider,
    onFileDrop,
    PlatformProvider,
    usePlatform,
    ShortcutsProvider,
    useShortcuts,
    ToastProvider,
    useToast,
    TooltipProvider,
    Tooltip,
    comparatorWithPriorities,
    CONSTANTS,
    withCoreSuspender,
    useCoreSuspender,
    getVisibleChildrenRange,
    interfaceLanguages,
    languageNames,
    languages,
    routesRegexp,
    useAnimationFrame,
    useBinaryState,
    useFullscreen,
    useInterval,
    useLiveRef,
    useModelState,
    useNotifications,
    useOnScrollToBottom,
    useProfile,
    useSettings,
    useShell,
    useStreamingServer,
    useTimeout,
    useTorrent,
    useTranslate,
    useOrientation,
    useLanguageSorting,
};

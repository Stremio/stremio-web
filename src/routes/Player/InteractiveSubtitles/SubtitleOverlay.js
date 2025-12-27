
const React = require('react');
const PropTypes = require('prop-types');
const ClickActionHandler = require('./ClickActionHandler');
const TranslationPopup = require('./TranslationPopup');

const SubtitleOverlay = ({ videoElement, containerRef, settings = {}, onProviderChange, getCachedTranslation, setCachedTranslation }) => {
    const [currentCue, setCurrentCue] = React.useState(null);
    const [popupState, setPopupState] = React.useState({ visible: false, position: { x: 0, y: 0 }, data: null, fromCache: false });
    const [notification, setNotification] = React.useState({ visible: false, message: '', position: { x: 0, y: 0 } });
    const currentCueRef = React.useRef(null);

    // Configurable action from settings (default to TRANSLATE)
    const clickAction = settings.clickAction || 'TRANSLATE';

    React.useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const findAndProcessSubtitles = () => {
            try {
                // Convert live HTMLCollection to static array
                const allDivs = Array.from(container.getElementsByTagName('div'));

                let foundText = null;
                let nodeToHide = null;

                for (const node of allDivs) {
                    // Skip our own interactive overlay elements
                    if (node.closest('[data-interactive-overlay]')) continue;

                    // Skip if no style attribute
                    if (!node.style) continue;

                    // Check if this div has text-shadow in computed or inline style
                    const inlineStyle = node.getAttribute('style') || '';
                    const hasTextShadow = inlineStyle.includes('text-shadow');

                    if (hasTextShadow) {
                        const text = node.textContent || node.innerText || '';
                        if (text.trim()) {
                            foundText = text.trim();
                            // Hide the parent wrapper
                            nodeToHide = node.parentElement;
                            break;
                        }
                    }
                }

                // Hide the native subtitle container
                if (nodeToHide && nodeToHide.style) {
                    nodeToHide.style.visibility = 'hidden';
                }

                // Update state if text changed
                if (foundText !== currentCueRef.current) {
                    currentCueRef.current = foundText;
                    setCurrentCue(foundText);
                }
            } catch (err) {
                console.error('SubtitleOverlay error:', err);
            }
        };

        // Run immediately
        findAndProcessSubtitles();

        // Use both observer and interval for reliability
        const observer = new MutationObserver(findAndProcessSubtitles);
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        // Fallback interval for cases where observer misses changes
        const interval = setInterval(findAndProcessSubtitles, 100);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, [containerRef]);

    const handleWordClick = async (e, word) => {
        e.stopPropagation(); // Prevent pausing video via container click

        // Pause video based on action type
        if (videoElement) {
            if (clickAction === 'TRANSLATE' && settings.pauseOnTranslate !== false) {
                videoElement.pause();
            } else if (clickAction === 'COPY' && settings.pauseOnCopy) {
                videoElement.pause();
            }
        }

        const rect = e.target.getBoundingClientRect();

        const position = {
            x: rect.left + (rect.width / 2) - 150,
            y: rect.top
        };

        // Check cache first (only for TRANSLATE action)
        if (clickAction === 'TRANSLATE' && getCachedTranslation) {
            // Create cache key based on provider
            // Google uses single targetLang, LLMs use multiple targetLangs
            const isLLMProvider = settings.provider && settings.provider !== 'GOOGLE';
            const cacheKey = isLLMProvider
                ? (settings.targetLangs || [settings.targetLang || 'eng']).sort().join(',')
                : (settings.targetLang || 'eng');
            const cached = getCachedTranslation(word, cacheKey);
            if (cached) {
                setPopupState({
                    visible: true,
                    loading: false,
                    position: position,
                    data: { word, type: 'TRANSLATE', provider: settings.provider, translation: cached },
                    fromCache: true,
                    cacheKey: cacheKey // Store cache key for deletion
                });
                return;
            }
        }

        // Handle COPY action with notification
        if (clickAction === 'COPY') {
            try {
                const result = await ClickActionHandler.handleWordClick(word, clickAction, settings);

                // Show brief notification
                setNotification({
                    visible: true,
                    message: result.message || 'Copied!',
                    position: position
                });

                // Auto-hide notification after 1 second
                setTimeout(() => {
                    setNotification({ visible: false, message: '', position: { x: 0, y: 0 } });
                }, 1000);
            } catch (err) {
                console.error(err);
                setNotification({
                    visible: true,
                    message: 'Copy failed',
                    position: position
                });
                setTimeout(() => {
                    setNotification({ visible: false, message: '', position: { x: 0, y: 0 } });
                }, 1000);
            }
            return;
        }

        // Show loading state immediately for TRANSLATE/WEBHOOK
        setPopupState({
            visible: true,
            loading: true,
            position: position,
            data: { word, type: 'LOADING' }
        });

        try {
            const result = await ClickActionHandler.handleWordClick(word, clickAction, settings);

            // Save to cache if translation was successful
            if (result.type === 'TRANSLATE' && !result.error && result.translation && setCachedTranslation) {
                // Create cache key based on provider
                // Google uses single targetLang, LLMs use multiple targetLangs
                const isLLMProvider = settings.provider && settings.provider !== 'GOOGLE';
                const cacheKey = isLLMProvider
                    ? (settings.targetLangs || [settings.targetLang || 'eng']).sort().join(',')
                    : (settings.targetLang || 'eng');
                setCachedTranslation(word, cacheKey, result.translation);
            }

            setPopupState({
                visible: true,
                loading: false,
                position: position,
                data: result
            });
        } catch (err) {
            console.error(err);
            setPopupState({
                visible: true,
                loading: false,
                position: position,
                data: { word, error: true, translation: err.message }
            });
        }
    };

    const closePopup = (e) => {
        if (e) e.stopPropagation();
        setPopupState({ ...popupState, visible: false });
    };

    // Delete cache entry for current word
    const handleDeleteCache = () => {
        if (!popupState.data?.word || !popupState.cacheKey) return;

        try {
            const cached = localStorage.getItem('stremio_interactive_subtitles_cache');
            if (!cached) return;
            const cache = JSON.parse(cached);
            const word = popupState.data.word.toLowerCase();

            if (cache[word] && cache[word][popupState.cacheKey]) {
                delete cache[word][popupState.cacheKey];
                if (Object.keys(cache[word]).length === 0) {
                    delete cache[word];
                }
                localStorage.setItem('stremio_interactive_subtitles_cache', JSON.stringify(cache));

                // Hide cache indicators after deletion
                setPopupState((prev) => ({
                    ...prev,
                    fromCache: false,
                    cacheKey: undefined
                }));
            }
        } catch (e) {
            console.error('Failed to delete cache entry:', e);
        }
    };

    // Callback for translating a new/edited word from the popup
    const handleTranslateWord = async (word) => {
        // Check cache first (only for TRANSLATE action)
        if (clickAction === 'TRANSLATE' && getCachedTranslation) {
            // Create cache key based on provider
            // Google uses single targetLang, LLMs use multiple targetLangs
            const isLLMProvider = settings.provider && settings.provider !== 'GOOGLE';
            const cacheKey = isLLMProvider
                ? (settings.targetLangs || [settings.targetLang || 'eng']).sort().join(',')
                : (settings.targetLang || 'eng');
            const cached = getCachedTranslation(word, cacheKey);
            if (cached) {
                setPopupState((prev) => ({
                    ...prev,
                    loading: false,
                    data: { word, type: 'TRANSLATE', provider: settings.provider, translation: cached },
                    fromCache: true,
                    cacheKey: cacheKey // Store cache key for deletion
                }));
                return;
            }
        }

        // Show loading state with new word
        setPopupState((prev) => ({
            ...prev,
            loading: true,
            data: { word, type: 'LOADING' }
        }));

        try {
            const result = await ClickActionHandler.handleWordClick(word, clickAction, settings);

            // Save to cache if translation was successful
            if (result.type === 'TRANSLATE' && !result.error && result.translation && setCachedTranslation) {
                // Create cache key based on provider
                // Google uses single targetLang, LLMs use multiple targetLangs
                const isLLMProvider = settings.provider && settings.provider !== 'GOOGLE';
                const cacheKey = isLLMProvider
                    ? (settings.targetLangs || [settings.targetLang || 'eng']).sort().join(',')
                    : (settings.targetLang || 'eng');
                setCachedTranslation(word, cacheKey, result.translation);
            }

            setPopupState((prev) => ({
                ...prev,
                loading: false,
                data: result
            }));
        } catch (err) {
            console.error(err);
            setPopupState((prev) => ({
                ...prev,
                loading: false,
                data: { word, error: true, translation: err.message }
            }));
        }
    };

    // Helper to Convert Percentage to vmin
    const getFontSize = () => {
        let sizeStr = settings.subtitleSize || '100%';
        if (typeof sizeStr === 'number') sizeStr = sizeStr + '%';

        const percentage = parseInt(sizeStr) || 100;
        const vmin = (percentage / 100) * 3;
        return `${vmin}vmin`;
    };

    // Get vertical position from offset setting (default 5% from bottom)
    const getVerticalPosition = () => {
        const offset = settings.subtitleOffset;
        if (offset === undefined || offset === null) return '5%';
        return `${offset}%`;
    };

    // Build text-shadow from outline color
    const getTextShadow = () => {
        const outlineColor = settings.subtitleOutlineColor || 'rgb(0, 0, 0)';
        return `${outlineColor} -0.15rem -0.15rem 0.15rem, ${outlineColor} 0px -0.15rem 0.15rem, ${outlineColor} 0.15rem -0.15rem 0.15rem, ${outlineColor} -0.15rem 0px 0.15rem, ${outlineColor} 0.15rem 0px 0.15rem, ${outlineColor} -0.15rem 0.15rem 0.15rem, ${outlineColor} 0px 0.15rem 0.15rem, ${outlineColor} 0.15rem 0.15rem 0.15rem`;
    };

    const fontSize = getFontSize();
    const textColor = settings.subtitleTextColor || 'rgb(255, 255, 255)';
    const backgroundColor = settings.subtitleBackgroundColor || 'rgba(0, 0, 0, 0)';
    const bottomPosition = getVerticalPosition();
    const textShadow = getTextShadow();

    // Split text into words for interactive clicking using Intl.Segmenter
    const words = React.useMemo(() => {
        if (!currentCue) return [];

        // Use Intl.Segmenter if available (better for all languages including CJK)
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
            const segments = segmenter.segment(currentCue);
            return Array.from(segments).map((seg) => seg.segment);
        }

        // Fallback to simple split for older browsers
        return currentCue.split(/([\s\n]+)/);
    }, [currentCue]);

    return (
        <div
            data-interactive-overlay="true"
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: bottomPosition,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
            }}
        >
            {/* Copy notification - small, auto-hide */}
            {notification.visible && (
                <div style={{
                    position: 'fixed',
                    left: notification.position.x + 'px',
                    top: Math.max(10, notification.position.y - 50) + 'px',
                    backgroundColor: '#1a1d26',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    zIndex: 10,
                    pointerEvents: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    border: '1px solid #333'
                }}>
                    {notification.message}
                </div>
            )}

            <TranslationPopup
                {...popupState}
                onClose={closePopup}
                onTranslate={handleTranslateWord}
                settings={settings}
                onProviderChange={onProviderChange}
                fromCache={popupState.fromCache}
                onDeleteCache={handleDeleteCache}
            />

            {words.length > 0 && (
                <div style={{
                    display: 'inline-block',
                    padding: '0.2em',
                    whiteSpace: 'pre-wrap',
                    fontSize: fontSize,
                    color: textColor,
                    backgroundColor: backgroundColor,
                    textShadow: textShadow,
                    lineHeight: '1.5',
                    pointerEvents: 'auto'
                }}>
                    {words.map((chunk, i) => {
                        if (/^[\s\n]+$/.test(chunk)) return <span key={i} style={{ fontSize }}>{chunk}</span>;
                        return (
                            <span
                                key={i}
                                onClick={(e) => handleWordClick(e, chunk)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'color 0.1s',
                                    fontSize: fontSize
                                }}
                                onMouseOver={(e) => e.target.style.color = '#FFD700'}
                                onMouseOut={(e) => e.target.style.color = textColor}
                            >
                                {chunk}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

SubtitleOverlay.propTypes = {
    videoElement: PropTypes.object,
    containerRef: PropTypes.object,
    settings: PropTypes.object,
    onProviderChange: PropTypes.func,
    getCachedTranslation: PropTypes.func,
    setCachedTranslation: PropTypes.func
};

module.exports = SubtitleOverlay;

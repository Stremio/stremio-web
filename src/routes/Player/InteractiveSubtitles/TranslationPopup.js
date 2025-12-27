
const React = require('react');
const PropTypes = require('prop-types');

// Provider list for cycling
const PROVIDERS = ['GOOGLE', 'GEMINI', 'OPENAI', 'CLAUDE', 'OLLAMA', 'OPENROUTER', 'CUSTOM'];

const styles = {
    container: {
        position: 'fixed',
        zIndex: 5,
        backgroundColor: '#1a1d26',
        color: '#ffffff',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        border: '1px solid #333',
        maxWidth: '320px',
        minWidth: '200px',
        fontSize: '14px',
        lineHeight: '1.4',
        pointerEvents: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        borderBottom: '1px solid #444',
        paddingBottom: '6px',
        cursor: 'grab',
        userSelect: 'none',
    },
    wordSection: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
    },
    word: {
        fontWeight: 'bold',
        color: '#FFD700',
        fontSize: '1.1em',
    },
    actionsSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginLeft: '8px',
    },
    iconButton: {
        background: 'transparent',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '2px 6px',
        lineHeight: 1,
        transition: 'color 0.2s',
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '2px 6px',
        lineHeight: 1,
        transition: 'color 0.2s',
    },
    inlineInput: {
        background: '#2a2d36',
        border: '1px solid #444',
        borderRadius: '4px',
        color: '#fff',
        padding: '2px 8px',
        fontSize: '1em',
        outline: 'none',
        width: '100px',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    message: {
        marginBottom: '8px',
        whiteSpace: 'pre-wrap',
    },
    link: {
        color: '#4daafc',
        textDecoration: 'none',
        fontSize: '0.85em',
        display: 'inline-block',
        marginTop: '6px'
    },
    provider: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '6px',
        fontSize: '0.75em',
        color: '#888',
        marginTop: '8px',
        borderTop: '1px solid #333',
        paddingTop: '6px',
    },
    providerIcon: {
        background: 'transparent',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '2px',
        lineHeight: 1,
        transition: 'color 0.2s',
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid #333',
        borderTop: '2px solid #4daafc',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    }
};

// Inject keyframes for spinner animation
if (typeof document !== 'undefined' && !document.getElementById('translation-popup-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'translation-popup-styles';
    styleSheet.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

const TranslationPopup = ({ visible, loading, position, data, onClose, onTranslate, settings, onProviderChange, fromCache, onDeleteCache }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);
    const [editValue, setEditValue] = React.useState('');
    const [searchValue, setSearchValue] = React.useState('');
    const [isPinned, setIsPinned] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = React.useState(position);
    const popupRef = React.useRef(null);

    // Cycle to next provider
    const handleProviderCycle = (e) => {
        e.stopPropagation();
        if (!onProviderChange || !settings) return;
        const currentProvider = settings.provider || 'GOOGLE';
        const currentIndex = PROVIDERS.indexOf(currentProvider);
        const nextIndex = (currentIndex + 1) % PROVIDERS.length;
        onProviderChange(PROVIDERS[nextIndex]);
    };

    // Get next provider name for tooltip
    const getNextProvider = () => {
        if (!settings) return PROVIDERS[0];
        const currentProvider = settings.provider || 'GOOGLE';
        const currentIndex = PROVIDERS.indexOf(currentProvider);
        const nextIndex = (currentIndex + 1) % PROVIDERS.length;
        return PROVIDERS[nextIndex];
    };

    // Click outside to close (unless pinned)
    React.useEffect(() => {
        if (!visible || isPinned) return;

        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [visible, isPinned, onClose]);

    // Update current position when position prop changes (new word clicked)
    React.useEffect(() => {
        setCurrentPosition(position);
    }, [position]);

    // Reset states when popup closes or word changes
    React.useEffect(() => {
        if (!visible) {
            setIsEditing(false);
            setIsSearching(false);
            setEditValue('');
            setSearchValue('');
            setIsPinned(false);
            setCurrentPosition(position);
        }
    }, [visible, position]);

    // Drag handlers
    const handleMouseDown = (e) => {
        // Only allow dragging from the header, not from buttons or inputs
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SPAN') {
            return;
        }
        setIsDragging(true);
        const rect = popupRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    React.useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            setCurrentPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    if (!visible || !data) return null;

    const style = {
        ...styles.container,
        left: currentPosition.x + 'px',
        top: Math.max(10, currentPosition.y - 150) + 'px',
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEditValue(data.word || '');
        setIsEditing(true);
        setIsSearching(false);
    };

    const handleSearchClick = (e) => {
        e.stopPropagation();
        setSearchValue('');
        setIsSearching(true);
        setIsEditing(false);
    };

    const handleEditSubmit = (e) => {
        e.stopPropagation();
        if (editValue.trim() && onTranslate) {
            onTranslate(editValue.trim());
        }
        setIsEditing(false);
    };

    const handleSearchSubmit = (e) => {
        e.stopPropagation();
        if (searchValue.trim() && onTranslate) {
            onTranslate(searchValue.trim());
        }
        setIsSearching(false);
        setSearchValue('');
    };

    const handleKeyDown = (e, submitFn) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            submitFn(e);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setIsSearching(false);
        }
    };

    return (
        <div ref={popupRef} style={style} onClick={(e) => e.stopPropagation()}>
            <div
                style={{
                    ...styles.header,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
            >
                <div style={styles.wordSection}>
                    {/* Pencil/Edit button */}
                    <button
                        style={styles.iconButton}
                        onClick={handleEditClick}
                        title="Edit word"
                    >
                        &#9998;
                    </button>

                    {/* Word or Edit Input */}
                    {isEditing ? (
                        <input
                            type="text"
                            style={styles.inlineInput}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleEditSubmit)}
                            onBlur={handleEditSubmit}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        data.word && <span style={styles.word}>{data.word}</span>
                    )}
                </div>

                <div style={styles.actionsSection}>
                    {/* Pin button */}
                    <button
                        style={{
                            ...styles.iconButton,
                            color: isPinned ? '#FFD700' : '#888'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPinned(!isPinned);
                        }}
                        title={isPinned ? 'Unpin' : 'Pin popup'}
                    >
                        {isPinned ? '📍' : '📌'}
                    </button>

                    {/* Search section */}
                    {isSearching ? (
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                style={styles.inlineInput}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, handleSearchSubmit)}
                                onBlur={() => setIsSearching(false)}
                                placeholder="New word..."
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    ) : (
                        <button
                            style={styles.iconButton}
                            onClick={handleSearchClick}
                            title="Search new word"
                        >
                            &#128269;
                        </button>
                    )}

                    {/* Close button */}
                    <button style={styles.closeButton} onClick={onClose} title="Close">&#10005;</button>
                </div>
            </div>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <span>Translating...</span>
                </div>
            ) : (
                <>
                    {data.error && (
                        <div style={{ ...styles.message, color: '#ff6b6b' }}>
                            {data.translation}
                        </div>
                    )}
                    {!data.error && data.translation && (
                        <div style={styles.message}>{data.translation}</div>
                    )}
                    {!data.error && data.message && (
                        <div style={styles.message}>{data.message}</div>
                    )}

                    {data.externalLink && (
                        <a
                            href={data.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.link}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Open in Google Translate &rarr;
                        </a>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                        borderTop: '1px solid #333',
                        paddingTop: '6px',
                    }}>
                        {/* Cache indicator (left side) */}
                        {fromCache && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75em',
                                color: '#4daafc'
                            }}>
                                <span title="Loaded from cache">🕒</span>
                                {onDeleteCache && (
                                    <button
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ff4444',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            padding: '2px',
                                            lineHeight: 1,
                                            transition: 'color 0.2s',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCache();
                                        }}
                                        title="Delete from cache"
                                    >
                                        &#128465;
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Provider info (right side) */}
                        {(data.provider || settings?.provider) && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.75em',
                                color: '#888',
                                marginLeft: 'auto'
                            }}>
                                <span>Provider: {settings?.provider || data.provider}</span>
                                {onProviderChange && (
                                    <button
                                        style={styles.providerIcon}
                                        onClick={handleProviderCycle}
                                        title={`Switch to ${getNextProvider()}`}
                                    >
                                        &#9881;
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

TranslationPopup.propTypes = {
    visible: PropTypes.bool,
    loading: PropTypes.bool,
    position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    data: PropTypes.object,
    onClose: PropTypes.func,
    onTranslate: PropTypes.func,
    settings: PropTypes.shape({
        provider: PropTypes.string
    }),
    onProviderChange: PropTypes.func,
    fromCache: PropTypes.bool,
    onDeleteCache: PropTypes.func
};

module.exports = TranslationPopup;

// Copyright (C) 2017-2025 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { default: Image } = require('stremio/components/Image');
const { useTranslation } = require('react-i18next');
const styles = require('./styles.less');

const HoverPreview = ({ className, name, type, releaseInfo, runtime, description, genres, rating, position }) => {
    const { t } = useTranslation();
    const previewRef = React.useRef(null);
    
    // Position can be a combination of 'top'|'bottom' and 'left'|'center'|'right'
    // Default is 'top-center'
    const positionVertical = position?.includes('bottom') ? 'bottom' : 'top';
    let positionHorizontal = 'center';
    
    if (position?.includes('left')) {
        positionHorizontal = 'left';
    } else if (position?.includes('right')) {
        positionHorizontal = 'right';
    }
    
    // Ensure preview stays within viewport bounds when it becomes visible
    React.useEffect(() => {
        const preview = previewRef.current;
        if (!preview) return;
        
        // Check if preview extends beyond viewport and adjust if needed
        const rect = preview.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Adjust horizontal position if needed
        if (rect.right > viewportWidth - 10) {
            preview.style.left = 'auto';
            preview.style.right = '0';
            preview.style.transform = 'translateX(0)';
        } else if (rect.left < 10) {
            preview.style.left = '0';
            preview.style.right = 'auto';
            preview.style.transform = 'translateX(0)';
        }
    }, [position]);
    
    return (
        <div 
            ref={previewRef}
            className={classnames(
                className, 
                styles['hover-preview-container'],
                styles[`position-${positionVertical}`],
                styles[`position-${positionHorizontal}`]
            )}
        >
            <div className={styles['content']}>
                <div className={styles['header']}>
                    <div className={styles['title']}>{name}</div>
                    {rating && (
                        <div className={styles['rating']}>
                            <Icon className={styles['star-icon']} name={'star'} />
                            <div className={styles['rating-value']}>{rating}</div>
                        </div>
                    )}
                </div>
                
                <div className={styles['meta-info']}>
                    {type && <span className={styles['type']}>{t(type.toUpperCase())}</span>}
                    {releaseInfo && <span className={styles['release-info']}>{releaseInfo}</span>}
                    {runtime && <span className={styles['runtime']}>{runtime}</span>}
                </div>
                
                {genres && genres.length > 0 && (
                    <div className={styles['genres']}>
                        {genres.map((genre, index) => (
                            <span key={index} className={styles['genre']}>{genre}</span>
                        ))}
                    </div>
                )}
                
                {description && (
                    <div className={styles['description']}>
                        {description.length > 150 ? `${description.substring(0, 150)}...` : description}
                    </div>
                )}
            </div>
        </div>
    );
};

HoverPreview.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    releaseInfo: PropTypes.string,
    runtime: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.string,
    position: PropTypes.string // Format: 'top-center', 'bottom-left', etc.
};

module.exports = HoverPreview;
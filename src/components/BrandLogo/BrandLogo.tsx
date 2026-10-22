import React from 'react';
import classnames from 'classnames';
import { useTheme } from 'stremio/common/Theme';
import styles from './BrandLogo.less';

type Props = {
    className?: string,
    // Show the wordmark next to the symbol (themes without one ignore this)
    wordmark?: boolean,
};

// Brand names are not translated
const WORDMARK = 'Stremio';
// Follows the illuminated "E" drop cap, so together they read "Elenio"
const DROP_CAP_WORDMARK = 'lenio';

// Lens-shaped overlap of two neighbouring dots (r = 12, centers 21 apart)
const DOT_OVERLAP = (x: number) => `M ${x} 8.19 A 12 12 0 0 1 ${x} 19.81 A 12 12 0 0 1 ${x} 8.19 Z`;

const LetterboxdDots = () => (
    <svg className={styles['dots']} viewBox={'0 0 70 28'} aria-hidden={true}>
        <circle cx={14} cy={14} r={12} fill={'#ff8000'} />
        <circle cx={35} cy={14} r={12} fill={'#00e054'} />
        <circle cx={56} cy={14} r={12} fill={'#40bcf4'} />
        <path d={DOT_OVERLAP(24.5)} fill={'#ffffff'} fillOpacity={0.35} />
        <path d={DOT_OVERLAP(45.5)} fill={'#ffffff'} fillOpacity={0.35} />
    </svg>
);

const BrandLogo = ({ className, wordmark = true }: Props) => {
    const theme = useTheme();

    if (theme === 'letterboxd') {
        return (
            <div className={classnames(className, styles['brand-logo'], styles['letterboxd'])}>
                <LetterboxdDots />
                {wordmark && <span className={styles['wordmark']}>{WORDMARK}</span>}
            </div>
        );
    }

    if (theme === 'elenio') {
        return (
            <div className={classnames(className, styles['brand-logo'], styles['elenio'])}>
                <img className={styles['drop-cap']} src={require('/assets/images/themes/eleinur/drop_cap.webp')} alt={'E'} />
                {wordmark && <span className={styles['wordmark']}>{DROP_CAP_WORDMARK}</span>}
            </div>
        );
    }

    if (theme === 'flannel') {
        return (
            <div className={classnames(className, styles['brand-logo'], styles['flannel'])}>
                <span className={styles['patch']}>{WORDMARK}</span>
            </div>
        );
    }

    return (
        <div className={classnames(className, styles['brand-logo'])}>
            <img className={styles['symbol']} src={require('/assets/images/stremio_symbol.png')} alt={' '} />
        </div>
    );
};

export default BrandLogo;

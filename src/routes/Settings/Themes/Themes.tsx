import React, { forwardRef, useCallback } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { Button } from 'stremio/components';
import { THEMES, setTheme, useTheme } from 'stremio/common/Theme';
import type { Theme, ThemeId } from 'stremio/common/Theme';
import { Section } from '../components';
import styles from './Themes.less';

const ThemePreview = ({ theme }: { theme: Theme }) => {
    const [background, surface, accent, text] = theme.swatches;

    return (
        <div className={classNames(styles['preview'], styles[`preview-${theme.id}`])} style={{ backgroundColor: background }}>
            <div className={styles['preview-bar']} style={{ backgroundColor: theme.id === 'elenio' ? accent : background }}>
                {
                    theme.id === 'letterboxd' ?
                        <div className={styles['preview-dots']}>
                            <span style={{ backgroundColor: '#ff8000' }} />
                            <span style={{ backgroundColor: '#00e054' }} />
                            <span style={{ backgroundColor: '#40bcf4' }} />
                        </div>
                        :
                        <span className={styles['preview-logo']} style={{ backgroundColor: theme.id === 'elenio' ? text : accent }} />
                }
                <span className={styles['preview-title']} style={{ color: text }}>{theme.name}</span>
            </div>
            <div className={styles['preview-content']} style={{ backgroundColor: theme.id === 'elenio' ? surface : 'transparent' }}>
                {
                    [0, 1, 2, 3].map((index) => (
                        <span
                            key={index}
                            className={styles['preview-poster']}
                            style={{
                                backgroundColor: index === 0 ? accent : surface,
                                borderColor: theme.id === 'elenio' ? accent : 'transparent',
                            }}
                        />
                    ))
                }
            </div>
        </div>
    );
};

const Themes = forwardRef<HTMLDivElement>((_, ref) => {
    const currentTheme = useTheme();

    const onSelect = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setTheme(event.currentTarget.dataset.theme as ThemeId);
    }, []);

    return (
        <Section ref={ref} className={styles['section']} label={'Themes'}>
            <div className={styles['themes']}>
                {
                    THEMES.map((theme) => (
                        <Button
                            key={theme.id}
                            className={classNames(styles['theme'], { [styles['selected']]: theme.id === currentTheme })}
                            title={theme.name}
                            data-theme={theme.id}
                            onClick={onSelect}
                        >
                            <ThemePreview theme={theme} />
                            <div className={styles['info']}>
                                <div className={styles['name']}>
                                    {theme.name}
                                    {
                                        theme.id === currentTheme &&
                                            <Icon className={styles['check']} name={'checkmark'} />
                                    }
                                </div>
                                <div className={styles['description']}>{theme.description}</div>
                            </div>
                        </Button>
                    ))
                }
            </div>
        </Section>
    );
});

export default Themes;

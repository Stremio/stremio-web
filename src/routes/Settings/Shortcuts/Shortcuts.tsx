import React, { forwardRef } from 'react';
import { Section } from '../components';
import { ShortcutsGroup } from 'stremio/components';
import { useShortcuts } from 'stremio/common';
import styles from './Shortcuts.less';

const Shortcuts = forwardRef<HTMLDivElement>((_, ref) => {
    const { grouped } = useShortcuts();

    return (
        <Section ref={ref} label={'SETTINGS_NAV_SHORTCUTS'}>
            {
                grouped.map(({ name, label, shortcuts }) => (
                    <ShortcutsGroup
                        key={name}
                        className={styles['shortcuts-group']}
                        label={label}
                        shortcuts={shortcuts}
                    />
                ))
            }
        </Section>
    );
});

export default Shortcuts;

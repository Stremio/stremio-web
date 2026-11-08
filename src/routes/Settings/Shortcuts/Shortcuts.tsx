import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShortcuts } from 'stremio/common';
import Combos from 'stremio/components/ShortcutsGroup/Combos';
import { Group, Row } from '../components';

const Shortcuts = () => {
    const { t } = useTranslation();
    const { grouped } = useShortcuts();

    return (
        <React.Fragment>
            {
                grouped.map(({ name, label, shortcuts }) => (
                    <Group key={name} title={t(label)}>
                        {
                            shortcuts.map((shortcut) => (
                                <Row key={shortcut.name} label={t(shortcut.label)} variant={'keys'}>
                                    <Combos combos={shortcut.combos} />
                                </Row>
                            ))
                        }
                    </Group>
                ))
            }
        </React.Fragment>
    );
};

export default Shortcuts;

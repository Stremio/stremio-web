// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useBinaryState, useMediaQuery } from 'stremio/common';
import useTranslate from 'stremio/common/useTranslate';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import Button from 'stremio/components/Button';
import Toggle from 'stremio/components/Toggle';
import screenSizes from 'stremio/common/screen-sizes.less';
import { Option } from '../../components';
import useBoardSpotlight from './useBoardSpotlight';
import PreviewCard from './PreviewCard';
import CatalogPicker from './CatalogPicker';
import CatalogSheet from './CatalogSheet';
import styles from './SpotlightSettings.less';

type Props = {
    profile: Profile,
};

const SpotlightSettings = ({ profile }: Props) => {
    const { catalogTitle } = useTranslate();
    const routeActive = useRouteActive();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);
    const { enabled, showCatalogRow, catalogs, selected, isDefault, toggleEnabled, toggleCatalogRow, select } = useBoardSpotlight(profile);
    const [pickerOpen, openPicker, closePicker] = useBinaryState(false);
    const off = !enabled;

    useEffect(() => {
        if (!routeActive) {
            closePicker();
        }
    }, [routeActive, closePicker]);

    return (
        <React.Fragment>
            <Option label={'SETTINGS_SHOW_SPOTLIGHT'}>
                <Toggle tabIndex={-1} checked={enabled} onClick={toggleEnabled} />
            </Option>
            <Option className={classNames({ [styles['off']]: off })} label={'SETTINGS_SPOTLIGHT_CATALOG'}>
                <Button
                    className={styles['value']}
                    aria-haspopup={'dialog'}
                    aria-expanded={pickerOpen}
                    onClick={openPicker}
                >
                    <div className={styles['label']}>{selected !== null ? catalogTitle(selected) ?? selected.name : ''}</div>
                    <Icon className={styles['icon']} name={'chevron-forward'} />
                </Button>
            </Option>
            <PreviewCard
                className={classNames(styles['preview'], { [styles['off']]: off })}
                catalog={selected}
                expanded={pickerOpen}
                onClick={openPicker}
            />
            <Option className={classNames({ [styles['off']]: off })} label={'SETTINGS_SPOTLIGHT_SHOW_ROW'}>
                <Toggle tabIndex={-1} checked={showCatalogRow} onClick={toggleCatalogRow} />
            </Option>
            {
                isMobile ?
                    <CatalogSheet
                        show={pickerOpen}
                        catalogs={catalogs}
                        isDefault={isDefault}
                        onSelect={select}
                        onClose={closePicker}
                    />
                    :
                    pickerOpen ?
                        <CatalogPicker
                            catalogs={catalogs}
                            isDefault={isDefault}
                            onSelect={select}
                            onClose={closePicker}
                        />
                        :
                        null
            }
        </React.Fragment>
    );
};

export default SpotlightSettings;

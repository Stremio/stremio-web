// Copyright (C) 2017-2026 Smart code 203358507

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useBinaryState, useMediaQuery } from 'stremio/common';
import useTranslate from 'stremio/common/useTranslate';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import Button from 'stremio/components/Button';
import Toggle from 'stremio/components/Toggle';
import screenSizes from 'stremio/common/screen-sizes.less';
import { Option } from '../../components';
import useBoardCatalogs from './useBoardCatalogs';
import useBoardSpotlight from './useBoardSpotlight';
import PreviewCard from './PreviewCard';
import CatalogPicker from './CatalogPicker';
import CatalogSheet from './CatalogSheet';
import styles from './SpotlightSettings.less';

type Props = {
    profile: Profile,
};

const SpotlightSettings = ({ profile }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const routeActive = useRouteActive();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);
    const [pickerOpen, openPicker, closePicker] = useBinaryState(false);
    const { selected, catalogs, spotlight } = useBoardCatalogs(pickerOpen);
    const { enabled, showCatalogRows, picks, isDefault, nudge, toggleEnabled, toggleCatalogRows, toggle, remove, reset } = useBoardSpotlight(profile, catalogs);
    const off = !enabled;
    const empty = selected !== null && catalogs.length === 0;
    const value = picks.length === 1 ?
        catalogTitle(picks[0]) ?? picks[0].name
        :
        picks.length > 1 || empty ? t('SETTINGS_SPOTLIGHT_CATALOGS', { count: picks.length }) : '';

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
            <Option className={classNames({ [styles['off']]: off })} label={'SETTINGS_SPOTLIGHT_CATALOGS_TITLE'}>
                <Button
                    className={styles['value']}
                    tabIndex={off ? undefined : 0}
                    aria-haspopup={'dialog'}
                    aria-expanded={pickerOpen}
                    onClick={openPicker}
                >
                    <div className={styles['label']}>{value}</div>
                    <Icon className={styles['icon']} name={'chevron-forward'} />
                </Button>
            </Option>
            <PreviewCard
                className={classNames(styles['preview'], { [styles['off']]: off })}
                empty={empty}
                picks={picks}
                preview={spotlight}
                expanded={pickerOpen}
                tabIndex={off ? undefined : 0}
                onClick={openPicker}
            />
            <Option className={classNames({ [styles['off']]: off })} label={picks.length > 1 ? 'SETTINGS_SPOTLIGHT_SHOW_ROWS' : 'SETTINGS_SPOTLIGHT_SHOW_ROW'}>
                <Toggle tabIndex={off ? undefined : -1} checked={showCatalogRows} onClick={toggleCatalogRows} />
            </Option>
            {
                isMobile ?
                    <CatalogSheet
                        show={pickerOpen}
                        catalogs={catalogs}
                        empty={empty}
                        picks={picks}
                        isDefault={isDefault}
                        nudge={nudge}
                        onToggle={toggle}
                        onRemove={remove}
                        onReset={reset}
                        onClose={closePicker}
                    />
                    :
                    pickerOpen ?
                        <CatalogPicker
                            catalogs={catalogs}
                            empty={empty}
                            picks={picks}
                            isDefault={isDefault}
                            nudge={nudge}
                            onToggle={toggle}
                            onRemove={remove}
                            onReset={reset}
                            onClose={closePicker}
                        />
                        :
                        null
            }
        </React.Fragment>
    );
};

export default SpotlightSettings;

// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from '@stremio/stremio-icons/react';
import { useMediaQuery } from 'stremio/common';
import useTranslate from 'stremio/common/useTranslate';
import { useRouteActive } from 'stremio/common/useRouteFocused';
import Button from 'stremio/components/Button';
import Toggle from 'stremio/components/Toggle';
import screenSizes from 'stremio/common/screen-sizes.less';
import { Row } from '../../components';
import useBoardSpotlight from './useBoardSpotlight';
import PreviewCard from './PreviewCard';
import CatalogPicker from './CatalogPicker';
import CatalogSheet from './CatalogSheet';
import styles from './SpotlightSettings.less';

type SpotlightState = {
    catalogs: BoardCatalogs,
    pickerOpen: boolean,
    openPicker: () => void,
    closePicker: () => void,
};

type Props = {
    profile: Profile,
    spotlight: SpotlightState,
};

const SpotlightSettings = ({ profile, spotlight: { catalogs: boardCatalogs, pickerOpen, openPicker, closePicker } }: Props) => {
    const { t } = useTranslation();
    const { catalogTitle } = useTranslate();
    const routeActive = useRouteActive();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xxsmall})`);
    const openerRef = useRef<HTMLElement | null>(null);
    const restoreFocusRef = useRef(false);
    const { selected, catalogs, spotlight } = boardCatalogs;
    const { enabled, showCatalogRows, picks, isDefault, nudge, toggleEnabled, toggleCatalogRows, toggle, remove, reset } = useBoardSpotlight(profile, catalogs);
    const off = !enabled;
    const empty = selected !== null && catalogs.length === 0;
    const value = picks.length === 1 ?
        catalogTitle(picks[0]) ?? picks[0].name
        :
        picks.length > 1 || empty ? t('SETTINGS_SPOTLIGHT_CATALOGS', { count: picks.length }) : '';

    const onOpenPicker = useCallback(() => {
        openerRef.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
        openPicker();
    }, [openPicker]);

    const onClosePicker = useCallback(() => {
        restoreFocusRef.current = true;
        closePicker();
    }, [closePicker]);

    const restoreFocus = useCallback(() => {
        if (restoreFocusRef.current) {
            openerRef.current?.focus({ preventScroll: true });
        }
        restoreFocusRef.current = false;
        openerRef.current = null;
    }, []);

    const onSheetExited = useCallback(() => {
        requestAnimationFrame(restoreFocus);
    }, [restoreFocus]);

    useEffect(() => {
        if (!routeActive) {
            closePicker();
        }
    }, [routeActive, closePicker]);

    useEffect(() => {
        if (!pickerOpen && !isMobile) {
            restoreFocus();
        }
    }, [pickerOpen, isMobile, restoreFocus]);

    return (
        <React.Fragment>
            <Row rowId={'spotlight'} label={t('SETTINGS_SHOW_SPOTLIGHT')}>
                <Toggle checked={enabled} onClick={toggleEnabled} />
            </Row>
            <Row className={classNames({ [styles['off']]: off })} rowId={'spotlightCatalogs'} label={t('SETTINGS_SPOTLIGHT_CATALOGS_TITLE')} control={'wide'}>
                <Button
                    className={styles['value']}
                    tabIndex={off ? undefined : 0}
                    aria-haspopup={'dialog'}
                    aria-expanded={pickerOpen}
                    onClick={onOpenPicker}
                >
                    <div className={styles['label']}>{value}</div>
                    <Icon className={styles['icon']} name={'chevron-forward'} />
                </Button>
            </Row>
            <PreviewCard
                className={classNames(styles['preview'], { [styles['off']]: off })}
                empty={empty}
                picks={picks}
                preview={spotlight}
                expanded={pickerOpen}
                tabIndex={off ? undefined : 0}
                onClick={onOpenPicker}
            />
            <Row className={classNames({ [styles['off']]: off })} rowId={'spotlightRows'} label={picks.length > 1 ? t('SETTINGS_SPOTLIGHT_SHOW_ROWS') : t('SETTINGS_SPOTLIGHT_SHOW_ROW')}>
                <Toggle tabIndex={off ? undefined : 0} checked={showCatalogRows} onClick={toggleCatalogRows} />
            </Row>
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
                        onClose={onClosePicker}
                        onExited={onSheetExited}
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
                            onClose={onClosePicker}
                        />
                        :
                        null
            }
        </React.Fragment>
    );
};

export type { SpotlightState };

export default SpotlightSettings;

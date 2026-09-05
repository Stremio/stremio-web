// Copyright (C) 2017-2026 Smart code 203358507

import React, { forwardRef, memo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Option from '../OptionsMenu/Option';
import styles from './styles.less';

type CastDevice = {
    id: string,
    name: string,
};

type Props = {
    className: string,
    devices: CastDevice[],
    loading: boolean,
    onDeviceSelected: (deviceId: string) => void,
};

const CastDevicesMenu = memo(forwardRef<HTMLDivElement, Props>(({ className, devices, loading, onDeviceSelected }, ref) => {
    const { t } = useTranslation();

    const onMouseDown = React.useCallback((event: MouseEvent) => {
        // @ts-expect-error: Property 'castDevicesMenuClosePrevented' does not exist on type 'MouseEvent'.
        event.nativeEvent.castDevicesMenuClosePrevented = true;
    }, []);

    return (
        <div ref={ref} className={classNames(className, styles['cast-devices-menu-container'])} onMouseDown={onMouseDown}>
            {
                devices.length > 0 ?
                    devices.map(({ id, name }) => (
                        <Option
                            key={id}
                            icon={'cast'}
                            label={t('PLAYER_PLAY_IN', { device: name })}
                            deviceId={id}
                            onClick={onDeviceSelected}
                        />
                    ))
                    :
                    <div className={styles['message']}>
                        {
                            loading ?
                                t('STREAM_LOADING')
                                :
                                t('PLAYER_NO_CAST_DEVICES_FOUND')
                        }
                    </div>
            }
        </div>
    );
}));

export default CastDevicesMenu;

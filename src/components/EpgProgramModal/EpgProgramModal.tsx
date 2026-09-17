// Copyright (C) 2017-2026 Smart code 203358507

import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'stremio/common/useMediaQuery';
import { EPGProgram } from 'stremio/common/EPG';
import MetaPreview from 'stremio/components/MetaPreview';
import MetaPreviewSheet from 'stremio/components/MetaPreviewSheet';
import ActionButton from 'stremio/components/MetaPreview/ActionButton';
import MetaLinks from 'stremio/components/MetaPreview/MetaLinks';
import ModalDialog from 'stremio/components/ModalDialog';
import screenSizes from 'stremio/common/screen-sizes.less';
import ProgramInfo from './ProgramInfo';
import styles from './EpgProgramModal.less';

type Props = {
    program: EPGProgram,
    now: number,
    show: boolean,
    onCloseRequest: () => void,
    channelHref?: string | null,
};

const EpgProgramModal = ({ program, now, show, onCloseRequest, channelHref }: Props) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery(`(max-width: ${screenSizes.xsmall})`);
    const genres = program.genres?.length ?
        program.genres
        :
        program.links?.filter(({ category }) => category === 'Genres').map(({ name }) => name) ?? [];
    const preview = (
        <MetaPreview
            className={styles['preview']}
            compact={true}
            name={program.title}
            background={program.thumbnail}
            description={program.overview}
            metadata={<ProgramInfo program={program} now={now} />}
            actions={
                channelHref ?
                    <ActionButton
                        className={styles['channel-button']}
                        icon={'chevron-forward'}
                        label={t('LIVE_TV_VIEW_CHANNEL', { defaultValue: 'View channel' })}
                        variant={'wide'}
                        href={channelHref}
                        onClick={onCloseRequest}
                    />
                    :
                    null
            }
        >
            {
                genres.length > 0 ?
                    <MetaLinks className={styles['genres']} label={'Genres'} links={genres.map((genre) => ({ label: genre }))} />
                    :
                    null
            }
        </MetaPreview>
    );

    if (isMobile) {
        return (
            <MetaPreviewSheet show={show} onCloseRequest={onCloseRequest} ariaLabel={program.title}>
                {preview}
            </MetaPreviewSheet>
        );
    }

    return show ? (
        <ModalDialog
            className={styles['modal']}
            onCloseRequest={onCloseRequest}
            role={'dialog'}
            aria-modal={'true'}
            aria-label={program.title}
        >
            {preview}
        </ModalDialog>
    ) : null;
};

export default EpgProgramModal;

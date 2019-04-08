import React from 'react';
import { storiesOf } from '@storybook/react';
import StreamsList from '../src/routes/Detail/StreamsList';
import colors from 'stremio-colors';
import appStyles from '../src/App/styles';

const streamsListStyle = {
    position: 'absolute',
    height: '100%',
    padding: '10px',
    minHeight: 'initial',
    background: colors.backgroundlighter
}

storiesOf('StreamsList', module)
    .add('short list of streams', () => (
        <div style={streamsListStyle} className={appStyles['app']}>
            <StreamsList
                streams={[
                    { id: '1', logo: 'ic_itunes', sourceName: 'iTunes', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '2', logo: '', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 50 },
                    { id: '3', logo: '', sourceName: 'Juan Carlos 2', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '4', logo: 'ic_amazon', sourceName: 'Amazon', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: '', progress: 0 }
                ]}
                onMoreAddonsClicked={function() { alert(123) }}
            />
        </div>
    ))
    .add('long list of streams', () => (
        <div style={streamsListStyle} className={appStyles['app']}>
            <StreamsList
                streams={[
                    { id: '1', logo: 'ic_itunes', sourceName: 'iTunes', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '2', logo: '', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 50 },
                    { id: '3', logo: '', sourceName: 'Juan Carlos 2', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: 'HDTV', progress: 50 },
                    { id: '4', logo: 'ic_amazon', sourceName: 'Amazon', title: 'Vikings S01E09 HDTV XviD-AFG[ettv], 👤 1', subtitle: '', progress: 0 },
                    { id: '5', logo: 'ic_amazon', sourceName: 'Amazon', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: '', progress: 0 },
                    { id: '6', logo: 'ic_netflix', sourceName: 'Netflix', title: '$1.99 purchase SD,$2.99 purchase HD', subtitle: 'HDTV', progress: 50 },
                    { id: '7', logo: '', sourceName: 'IBERIAN', title: '', subtitle: '', progress: 0 },
                    { id: '8', logo: 'ic_netflix', sourceName: 'Netflix', title: 'SD', subtitle: '', progress: 50 },
                    { id: '9', logo: 'ic_itunes', sourceName: 'Netflix', title: 'SD', subtitle: 'HDTV', progress: 50 },
                    { id: '10', logo: 'ic_amazon', sourceName: 'Amazon', title: '', subtitle: 'HDTV', progress: 0 }
                ]}
            />
        </div>
    ));
    
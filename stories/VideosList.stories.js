import React from 'react';
import { storiesOf } from '@storybook/react';
import { FocusableProvider } from 'stremio-common';
import VideosList from '../src/routes/Detail/VideosList';
import ModalsContainerProvider from '../src/common/Router/Route/ModalsContainerProvider';
import appStyles from '../src/App/styles';
import styles from './styles';

const onModalsContainerDomTreeChange = ({ modalsContainerElement }) => {
    return modalsContainerElement.childElementCount === 0;
};

storiesOf('VideosList', module)
    .add('list of videos', () => (
        <ModalsContainerProvider>
            <FocusableProvider onModalsContainerDomTreeChange={onModalsContainerDomTreeChange}>
                <div className={appStyles['app']}>
                    <VideosList
                        className={styles['videos-list']}
                        videos={[
                            { id: '1', poster: 'https://www.stremio.com/websiste/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '2', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 3 },
                            { id: '3', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 5 },
                            { id: '4', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 4 },
                            { id: '5', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '6', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '7', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '8', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '9', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '10', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '11', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '12', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '13', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '14', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '15', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '16', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '17', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '18', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '19', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '20', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '21', poster: 'https://www.stremiocom/wsebsite/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '22', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '23', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '24', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '25', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '26', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 3 },
                            { id: '27', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '28', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 5 },
                            { id: '29', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '30', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '31', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '32', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '33', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '34', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '35', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '36', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '37', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '38', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '39', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '40', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '41', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 },
                            { id: '42', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 1, name: 'The Bing BranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBranHypothesiingBran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesiing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, isWatched: true, season: 1 },
                            { id: '43', poster: 'https://www.stremio.com/website/home-stremio.png', episode: 2, name: 'The Bing Bran Hypothesis', description: 'dasdasda', released: new Date(2018, 4, 23), isWatched: true, season: 1 },
                            { id: '44', episode: 4, name: 'The Luminous Fish Effect', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 1 },
                            { id: '45', poster: 'https://www.stremiocom/website/home-stremio.png', episode: 5, name: 'The Dumpling Paradox', description: 'dasdasda', released: new Date(2018, 4, 23), progress: 50, season: 2 },
                            { id: '46', episode: 8, name: 'The Loobendfeld Decay', description: 'dasdasda', released: new Date(2018, 4, 23), isUpcoming: true, season: 1 }
                        ]}
                    />
                </div>
            </FocusableProvider>
        </ModalsContainerProvider>
    ));

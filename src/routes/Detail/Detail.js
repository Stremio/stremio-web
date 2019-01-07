import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VideosList from './VideosList';
import Icon from 'stremio-icons/dom';
import styles from './styles';

class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logoLoaded: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.logoLoaded !== this.state.logoLoaded;
    }

    renderSection({ title, links }) {
        return (
            <div className={styles['section-container']}>
                {
                    title ?
                        <div className={styles['title']}>{title}</div>
                        :
                        null
                }
                {links.map(link => <a key={link} className={styles['link']}>{link}</a>)}
            </div>
        );
    }

    render() {
        return (
            <div style={this.props.metaItem.background.length > 0 ? { backgroundImage: 'url(' + this.props.metaItem.background + ')' } : { backgroundColor: colors.backgrounddarker }} className={styles['detail-container']}>
                <div className={styles['overlay-container']} />
                <div className={styles['info-container']}>
                    {
                        this.state.logoLoaded ?
                            <img className={styles['logo']} src={this.props.metaItem.logo} onError={() => this.setState({ logoLoaded: false })} />
                            :
                            null
                    }
                    <div className={styles['duration']}>{this.props.metaItem.duration}</div>
                    <div className={styles['release-info']}>
                        {
                            this.props.metaItem.releaseInfo.length > 0 ?
                                this.props.metaItem.releaseInfo
                                :
                                this.props.metaItem.released.getFullYear()
                        }
                    </div>
                    <div className={styles['name']}>{this.props.metaItem.name}</div>
                    <div className={styles['description']}>{this.props.metaItem.description}</div>
                    {this.renderSection({ title: 'GENRES', links: this.props.metaItem.genres })}
                    {this.renderSection({ title: 'WRITTEN BY', links: this.props.metaItem.writers })}
                    {this.renderSection({ title: 'DIRECTED BY', links: this.props.metaItem.directors })}
                    {this.renderSection({ title: 'CAST', links: this.props.metaItem.cast })}
                    <div className={styles['action-buttons-container']}>
                        <a href={this.props.metaItem.links.youtube} className={styles['action-button-container']}>
                            <Icon className={styles['icon']} icon={'ic_movies'} />
                            <div className={styles['label']}>Trailer</div>
                        </a>
                        <a href={this.props.metaItem.links.imdb} target={'_blank'} className={styles['action-button-container']}>
                            <Icon className={styles['icon']} icon={'ic_imdb'} />
                            <div className={styles['label']}>{this.props.metaItem.imdbRating} / 10</div>
                        </a>
                        <div className={styles['action-button-container']} onClick={this.props.toggleLibraryButton}>
                            <Icon className={styles['icon']} icon={this.props.inLibrary ? 'ic_removelib' : 'ic_addlib'} />
                            <div className={styles['label']}>{this.props.inLibrary ? 'Remove from Library' : 'Add to library'}</div>
                        </div>
                        <div className={styles['action-button-container']}>
                            <Icon className={styles['icon']} icon={'ic_share'} />
                            <div className={styles['label']}>Share</div>
                        </div>
                    </div>
                </div>
                <VideosList className={styles['videos-list']} videos={this.props.metaItem.videos}></VideosList>
            </div>
        );
    }
}

Detail.propTypes = {
    inLibrary: PropTypes.bool.isRequired,
    metaItem: PropTypes.object.isRequired,
    toggleLibraryButton: PropTypes.func
};
Detail.defaultProps = {
    inLibrary: false,
    metaItem: {
        logo: 'https://images.metahub.space/logo/medium/tt4123430/img',
        background: 'https://images.metahub.space/background/medium/tt4123430/img',
        duration: '134 min',
        releaseInfo: '2018',
        released: new Date(2018, 4, 23),
        imdbRating: '7.4',
        name: 'Fantastic Beasts and Where to Find Them: The Original Screenplay',
        description: 'In an effort to thwart Grindelwald' + 's plans ofraisingpurebloodwizardstoansofraisingpurebloodwizardstoansofraisingpurebloodwizardstoansofraising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards toans of raising pure-blood wizards to rule over all non-magical beings, Albus Dumbledore enlists his former student Newt Scamander, who agrees to help, unaware of the dangers that lie ahead. Lines are drawn as love and loyalty are tested, even among the truest friends and family, in an increasingly divided wizarding world.',
        genres: ['Adventure', 'Family', 'Fantasy'],
        writers: ['J. K. Rowling'],
        directors: ['David Yates'],
        cast: ['Johny Depp', 'Kevin Guthrie', 'Carmen Ejogo', 'Wolf Roth'],
        videos: [
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
        ],
        links: {
            share: '',
            imdb: 'https://www.imdb.com/title/tt4123430/?ref_=fn_al_tt_3',
            youtube: '#/player'
        }
    }
};

export default Detail;

const React = require('react');
const { useModelState, useProfile } = require('stremio/common');

const useMetaDetailsForMetaItem = (metaItemPreview) => {
    const profile = useProfile();
    // Create a unique model name for each meta item to avoid state conflicts
    const modelName = React.useMemo(() => {
        return metaItemPreview && metaItemPreview.id ? `metaDetails_${metaItemPreview.id}` : null;
    }, [metaItemPreview?.id]);

    const metaDetails = useModelState({
        model: modelName,
        action: React.useMemo(() => {
            if (!metaItemPreview || !metaItemPreview.id || !metaItemPreview.type) {
                return null;
            }
            return {
                action: 'Load',
                args: {
                    model: 'MetaDetails',
                    args: {
                        type: metaItemPreview.type,
                        id: metaItemPreview.id
                    }
                }
            };
        }, [metaItemPreview?.id, metaItemPreview?.type])
    });

    const nextEpisodeReleaseDate = React.useMemo(() => {
        if (metaDetails && metaDetails.content?.type === 'Ready' && Array.isArray(metaDetails.content.content.videos)) {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Normalize 'now' to start of day

            const upcomingVideos = metaDetails.content.content.videos.filter((video) => {
                // Check if the video is scheduled and has a release date
                if (video.scheduled && video.released) {
                    // Parse the release date string (e.g., 'YYYY-MM-DD')
                    const [year, month, day] = video.released.split('-').map(Number);
                    const releaseDate = new Date(year, month - 1, day); // month - 1 because Date months are 0-indexed

                    // Only consider episodes that are in the future or today
                    return releaseDate >= now;
                }
                return false;
            }).sort((a, b) => {
                // Sort by release date to find the soonest upcoming episode
                const dateA = new Date(a.released);
                const dateB = new Date(b.released);
                return dateA.getTime() - dateB.getTime();
            });

            if (upcomingVideos.length > 0) {
                const nextVideo = upcomingVideos[0];
                const [year, month, day] = nextVideo.released.split('-').map(Number);
                const releaseDate = new Date(year, month - 1, day);
                // Format the date string using the user's interface language
                return releaseDate.toLocaleDateString(profile.settings.interfaceLanguage, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
            }
        }
        return null;
    }, [metaDetails, profile.settings.interfaceLanguage]);

    return nextEpisodeReleaseDate;
};

module.exports = useMetaDetailsForMetaItem;

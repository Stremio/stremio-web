const React = require('react');
const useModelState = require('stremio/common/useModelState');
const useProfile = require('stremio/common/useProfile');

const useMetaDetailsForMetaItem = (metaItemPreview, enabled = true) => {
    const profile = useProfile();
    // Use the singleton model name 'meta_details' which is guaranteed to exist in the core
    const modelName = enabled ? 'meta_details' : null;

    const metaDetails = useModelState({
        model: modelName,
        skipUnload: true,
        action: React.useMemo(() => {
            const id = metaItemPreview?.id || metaItemPreview?._id;
            if (!enabled || !id || !metaItemPreview?.type) {
                return null;
            }
            return {
                action: 'Load',
                args: {
                    model: 'MetaDetails',
                    args: {
                        metaPath: {
                            resource: 'meta',
                            type: metaItemPreview.type,
                            id: id,
                            extra: []
                        }
                    }
                }
            };
        }, [enabled, metaItemPreview?.id, metaItemPreview?._id, metaItemPreview?.type])
    });

    const nextEpisodeReleaseDate = React.useMemo(() => {
        // Ensure we are looking at the CORRECT item in the singleton model
        const id = metaItemPreview?.id || metaItemPreview?._id;
        const metaItem = metaDetails?.metaItem;
        if (enabled && metaItem?.content?.type === 'Ready' && metaItem.content.content?.id === id && Array.isArray(metaItem.content.content.videos)) {
            const metaItemContent = metaItem.content;
            const now = new Date();
            const nowTime = now.getTime();
            const next7Days = new Date(now);
            next7Days.setDate(now.getDate() + 7);
            const next7DaysTime = next7Days.getTime();

            const upcomingVideos = metaItemContent.content.videos
                .filter((video) => {
                    if (video.released) {
                        const releaseDate = new Date(video.released);
                        const releaseTime = releaseDate.getTime();
                        return !isNaN(releaseTime) && releaseTime >= nowTime && releaseTime <= next7DaysTime;
                    }
                    return false;
                })
                .sort((a, b) => {
                    const timeA = new Date(a.released).getTime();
                    const timeB = new Date(b.released).getTime();
                    const validA = !isNaN(timeA);
                    const validB = !isNaN(timeB);
                    if (!validA && !validB) return 0;
                    if (!validA) return 1;
                    if (!validB) return -1;
                    return timeA - timeB;
                });

            if (upcomingVideos.length > 0) {
                const releaseDate = new Date(upcomingVideos[0].released);
                return releaseDate.toLocaleDateString(profile?.settings?.interfaceLanguage || 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });
            }
        }
        return null;
    }, [enabled, metaDetails, profile?.settings?.interfaceLanguage, metaItemPreview?.id, metaItemPreview?._id]);

    return nextEpisodeReleaseDate;
};

module.exports = useMetaDetailsForMetaItem;

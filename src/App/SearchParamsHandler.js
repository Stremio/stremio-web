// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const isEqual = require('lodash.isequal');
const { withCoreSuspender, useProfile, useToast } = require('stremio/common');
const { useServices } = require('stremio/services');

const SearchParamsHandler = () => {
    const { core } = useServices();
    const profile = useProfile();
    const toast = useToast();

    const [searchParams, setSearchParams] = React.useState({});
    const processedAddonsCollectionRef = React.useRef(null);

    const onLocationChange = () => {
        const { origin, hash, search } = window.location;
        const { searchParams } = new URL(`${origin}${hash.replace('#', '')}${search}`);

        setSearchParams((previousSearchParams) => {
            const currentSearchParams = Object.fromEntries(searchParams.entries());
            return isEqual(previousSearchParams, currentSearchParams) ? previousSearchParams : currentSearchParams;
        });
    };

    React.useEffect(() => {
        const { streamingServerUrl, addonsCollection } = searchParams;

        if (streamingServerUrl) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        streamingServerUrl,
                    },
                },
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'AddServerUrl',
                    args: streamingServerUrl,
                },
            });
            toast.show({
                type: 'success',
                title: `Using streaming server at ${streamingServerUrl}`,
                timeout: 4000,
            });
        }

        // Handle custom add-ons collection for new users and guests
        // This allows distributing pre-configured add-on bundles via URL parameter
        // Example: ?addonsCollection=https://example.com/addons.json
        if (addonsCollection && typeof addonsCollection === 'string' && addonsCollection.length > 0) {
            // Processing this collection only once per session
            if (processedAddonsCollectionRef.current === addonsCollection) {
                return;
            }

            const isNewUserOrGuest = !profile?.auth || profile?.auth?.user?.isNewUser === true;

            if (isNewUserOrGuest) {
                processedAddonsCollectionRef.current = addonsCollection;
                fetch(addonsCollection)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch add-ons collection: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then((collectionData) => {
                        // Install each add-on from the collection
                        if (Array.isArray(collectionData)) {
                            // For each entry, ensuring that the Core with a proper `manifest` object.
                            const installPromises = collectionData.map((addon) => {
                                return new Promise((resolve) => {
                                    (async () => {
                                        try {
                                            // Helper to dispatch InstallAddon with manifest object
                                            const doDispatch = (manifestObj, transportUrl, name) => {
                                                const args = {};
                                                if (manifestObj) args.manifest = manifestObj;
                                                if (transportUrl) args.transportUrl = transportUrl;
                                                if (name) args.name = name;
                                                if (Object.keys(args).length > 0) {
                                                    core.transport.dispatch({
                                                        action: 'Ctx',
                                                        args: {
                                                            action: 'InstallAddon',
                                                            args,
                                                        },
                                                    });
                                                }
                                            };

                                            if (typeof addon === 'string') {
                                                // treat as manifest URL: fetch and parse
                                                const manifestUrl = addon;
                                                try {
                                                    const res = await fetch(manifestUrl);
                                                    if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.statusText}`);
                                                    const manifestObj = await res.json();
                                                    doDispatch(manifestObj, manifestUrl, null);
                                                } catch (e) {
                                                    console.error('Failed to fetch/parse manifest for', manifestUrl, e);
                                                }
                                            } else if (addon && typeof addon === 'object') {
                                                // addon may contain manifest as object or URL
                                                const name = typeof addon.name === 'string' ? addon.name : null;
                                                if (addon.manifest && typeof addon.manifest === 'object') {

                                                    doDispatch(addon.manifest, addon.transportUrl || null, name);
                                                } else {
                                                    // manifest field might be a URL, or fallback to transportUrl/url
                                                    const manifestUrl = addon.manifest || addon.transportUrl || addon.url || null;
                                                    if (manifestUrl && typeof manifestUrl === 'string') {
                                                        try {
                                                            const res = await fetch(manifestUrl);
                                                            if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.statusText}`);
                                                            const manifestObj = await res.json();
                                                            doDispatch(manifestObj, addon.transportUrl || manifestUrl, name);
                                                        } catch (e) {
                                                            console.error('Failed to fetch/parse manifest for', manifestUrl, e);
                                                        }
                                                    } else {
                                                        console.warn('Skipping invalid add-on entry in collection:', addon);
                                                    }
                                                }
                                            } else {
                                                console.warn('Skipping invalid add-on entry in collection:', addon);
                                            }
                                        } catch (e) {
                                            console.error('Error processing add-on entry:', addon, e);
                                        } finally {
                                            resolve();
                                        }
                                    })();
                                });
                            });

                            Promise.all(installPromises).then(() => {
                                toast.show({
                                    type: 'success',
                                    title: `Processed ${collectionData.length} add-on entries from collection`,
                                    timeout: 4000,
                                });
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to load add-ons collection:', error);
                        toast.show({
                            type: 'error',
                            title: 'Failed to load add-ons collection',
                            timeout: 4000,
                        });
                    });
            }
        }
    }, [searchParams]);

    React.useEffect(() => {
        onLocationChange();
        window.addEventListener('hashchange', onLocationChange);
        return () => window.removeEventListener('hashchange', onLocationChange);
    }, []);

    return null;
};

module.exports = withCoreSuspender(SearchParamsHandler);

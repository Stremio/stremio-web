// Force hosted Stremio Web/Core to use the public Wallis streaming server
// instead of the browser client's localhost.
const STREAMING_SERVER_URL = 'https://stremio.wallmail.se';
const LOCAL_STREAMING_SERVER_RE = /^http:\/\/(?:127\.0\.0\.1|localhost):11470(?=\/|$)/;

const rewriteUrl = (url) => (
    typeof url === 'string'
        ? url.replace(LOCAL_STREAMING_SERVER_RE, STREAMING_SERVER_URL)
        : url
);

const installFetchRewrite = (scope) => {
    if (!scope || scope.__wallisStreamingServerRewriteInstalled) return;
    scope.__wallisStreamingServerRewriteInstalled = true;

    if (typeof scope.fetch === 'function') {
        const nativeFetch = scope.fetch.bind(scope);
        scope.fetch = (input, init) => {
            if (typeof input === 'string') {
                return nativeFetch(rewriteUrl(input), init);
            }

            if (typeof URL !== 'undefined' && input instanceof URL) {
                return nativeFetch(new URL(rewriteUrl(input.href)), init);
            }

            if (typeof Request !== 'undefined' && input instanceof Request && LOCAL_STREAMING_SERVER_RE.test(input.url)) {
                return nativeFetch(new Request(rewriteUrl(input.url), input), init);
            }

            return nativeFetch(input, init);
        };
    }

    const XMLHttpRequestCtor = scope.XMLHttpRequest;
    if (XMLHttpRequestCtor?.prototype?.open) {
        const nativeOpen = XMLHttpRequestCtor.prototype.open;
        XMLHttpRequestCtor.prototype.open = function open(method, url, ...rest) {
            return nativeOpen.call(this, method, rewriteUrl(url), ...rest);
        };
    }
};

installFetchRewrite(typeof globalThis !== 'undefined' ? globalThis : undefined);

module.exports = {
    STREAMING_SERVER_URL,
    rewriteUrl,
};

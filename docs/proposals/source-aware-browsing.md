# Show source availability before opening a movie

Status: draft design with a first implementation for review. The broad Sources found browsing mode below remains a proposal. The code currently adds an opt-in check for one selected movie in Discover; see [implementation and review guide](../source-check-review.md) for the delivered scope and dependencies.

## The problem

A user installs Stremio, sees movie posters, and reasonably expects to watch those movies. They open one and see “No streams were found.” They go back, choose another, and receive the same message. The browsing screen gives them no information that helps them choose differently.

Catalog entries describe titles. They do not establish that the user's installed addons can supply a video. We should make that distinction visible before a user spends time opening a title.

## Proposed experience

Add a **Sources found** mode alongside **All titles** in Discover. Explain it as “Show movies where your addons found a video source.” Remember the choice for this device. Keep existing browsing as the initial default during rollout; offer the new mode directly from the empty stream screen. After validation, consider making it the default for new users.

In Sources found mode:

1. Check a bounded batch of movie candidates from the selected catalog.
2. Show a movie card only after finding a source that the current client can offer as a playback action.
3. While checks run, show “Checking your addons…” and a checked count. Do not show an empty-results message prematurely.
4. If the batch has no matches, show “No sources found in the movies checked” with **Check more movies**, **Manage addons**, and **Show all titles** actions.
5. If checks fail, show “Some addons could not be checked” with **Retry**. Do not imply that the catalog has no available movies.

All titles mode keeps browsing and watchlist features available. Display known status on checked cards, and let a user explicitly check an unknown movie. A known-empty card opens an explanation and **Check again** action rather than immediately repeating the empty stream journey. Include **View details** so unavailable titles can still be researched or added to a watchlist.

When a user returns from details, preserve their catalog, scroll position, selection, and recent source results. Do not make them start over.

“Sources found” is deliberately narrower than “Playable.” A link may expire, require a subscription, fail during playback, or depend on an unavailable streaming server. This feature prevents known empty-source journeys; it cannot guarantee successful playback.

### Example

| Movie | Result from the user's addons | Sources found mode |
| --- | --- | --- |
| Movie A | A usable source was returned | Show the movie |
| Movie B | All relevant checks completed with no source | Omit the movie |
| Movie C | One addon failed; the others returned nothing | Omit it, count the failed check, offer Retry |
| Movie D | No check has completed | Keep it pending; do not call it unavailable |
| Movie E | Only a link to an external service was returned | Label it “Watch externally” in All titles; omit it from this mode |

These are hypothetical titles and outcomes, not claims about a particular addon.

## What the code does today

The references below describe the inspected development revisions, rather than an assumed API:

- Web: [`509023270583077538caed04ffde0686cfa19bd9`](https://github.com/Stremio/stremio-web/tree/509023270583077538caed04ffde0686cfa19bd9).
- Core: [`3ac269b470854d14033f1971dfbf4022831d57f5`](https://github.com/Stremio/stremio-core/tree/3ac269b470854d14033f1971dfbf4022831d57f5).

| Existing code | Relevance |
| --- | --- |
| [`Discover.js`](../../src/routes/Discover/Discover.js) | Renders catalog items as cards without a per-item source check. Its automatic page loading must be bounded when filtering removes cards. |
| [`useDiscover.js`](../../src/routes/Discover/useDiscover.js) | Loads the core catalog model and requests subsequent pages. |
| [`MetaItem.js`](../../src/components/MetaItem/MetaItem.js) | Navigates to details using the item's deep links. Shared by browsing surfaces. |
| [`useMetaDetails.js`](../../src/routes/MetaDetails/useMetaDetails.js) | Dispatches the MetaDetails load action with a stream path or `guessStream`. |
| [`StreamsList.js`](../../src/routes/MetaDetails/StreamsList/StreamsList.js) | Builds the source list from ready responses and displays the empty-stream state. |
| [`meta_details.rs`](https://github.com/Stremio/stremio-core/blob/3ac269b470854d14033f1971dfbf4022831d57f5/src/models/meta_details.rs) | Resolves metadata, embedded video streams, and addon stream requests. |
| [`manifest.rs`](https://github.com/Stremio/stremio-core/blob/3ac269b470854d14033f1971dfbf4022831d57f5/src/types/addon/manifest.rs) and [`request.rs`](https://github.com/Stremio/stremio-core/blob/3ac269b470854d14033f1971dfbf4022831d57f5/src/types/addon/request.rs) | Match resource types and ID prefixes and plan requests to installed addons. |
| [`resource_loadable.rs`](https://github.com/Stremio/stremio-core/blob/3ac269b470854d14033f1971dfbf4022831d57f5/src/models/common/resource_loadable.rs) | Distinguishes loading, ready, empty content, and request failures. |
| [`serialize_meta_details.rs`](https://github.com/Stremio/stremio-core/blob/3ac269b470854d14033f1971dfbf4022831d57f5/stremio-core-web/src/model/serialize_meta_details.rs) | Exposes sources to the web app and currently prefers embedded metadata streams when present. |

Do not build the feature by repeatedly loading the shared MetaDetails model for every card. That would replace the current details selection. Use independent availability state, sharing the existing request planning and source resolution rules.

## Availability rules

Maintain separate request outcomes and display states. A failed request must never become a successful empty response.

| State | Meaning | User-facing text |
| --- | --- | --- |
| Unknown | Not checked, expired, cancelled, or invalidated | Not checked |
| Checking | Relevant checks are still running and no usable source is known | Checking sources… |
| Sources found | At least one current source has a supported playback action | Sources found |
| External only | Completed checks found only external-service actions | Watch externally |
| No sources | Every relevant check completed successfully without a usable or external source | No sources found |
| Check failed | No usable source is known, and at least one required check failed | Could not check sources |
| No matching provider | Request planning and metadata resolution found no applicable way to supply this video | No matching video addon |
| Unsupported here | Sources were returned, but the client knows it cannot offer playback for them | Not supported on this device |

A supported source can produce a positive result immediately even if another addon is still pending or has failed. In the absence of a positive result, pending checks take precedence over a final negative result. A final failure takes precedence over “No sources.” Preserve external-only and unsupported-source evidence even when the overall check is incomplete.

Use the current playback path's capability rules. Do not infer support from a filename, resolution label, nonempty JSON object, or the mere presence of a URL. Do not count trailers as full-movie sources. Count embedded video streams and existing video-ID resolution paths, including the existing YouTube handling, rather than assuming every title requires a separate stream addon.

The absence of a `stream` resource alone is therefore not enough to declare the user's setup unable to play anything. Show a setup explanation based on what was actually checked: “These addons did not provide video sources for the movies checked.” Offer Manage addons without recommending particular third-party services or promising that an installation will fix a specific title.

## Requests, privacy, and cache

Put availability coordination in stremio-core so clients share the same meaning of a result. The web UI should request checks and render state, rather than reimplementing the addon protocol with independent browser fetches.

Proposed initial limits, to be confirmed with measurements:

- Up to 20 movie candidates per user-requested batch.
- At most 4 active network requests overall and 2 per addon transport origin for background checks. Apply these limits to metadata requests as well as stream requests.
- A 10-second deadline per active request, starting when it leaves the queue. A timeout is a failed check, not an empty result.
- No automatic retries or unbounded catalog traversal. A manual Check more action starts the next bounded batch. Apply a page-request cap as well as the candidate cap so empty or duplicate pages cannot cause a loop.
- Give explicit details/playback requests priority over background checks. Deduplicate shared requests; cancelling browsing must not cancel a request still used by details.
- Stop scheduling when the route becomes inactive. Cancel unused in-flight requests where the transport permits it, and ignore stale responses using a generation identifier regardless of cancellation support.

For each batch, retain the original catalog order as checks settle. Do not move or remove the keyboard-focused card. Separate pending progress from selectable results and announce completion politely for screen readers.

Cache results in memory, with a proposed maximum of 500 video entries. Reuse results from normal details visits as well as background checks. Start with a five-minute upper lifetime for positive results and one minute for completed empty results; respect a shorter declared response lifetime. These durations are tuning proposals, not guarantees about link validity. Do not cache failures as absence. Explicit Retry starts a new check, subject to the same request limits.

Key results by video type, resolved video ID, relevant request extras, addon configuration revision, and playback environment revision. Invalidate on addon installation, removal, reconfiguration or reordering, account changes, and changes to settings that affect visible sources or playback support. Discard responses from an earlier revision. Refresh expired results before admitting a card into Sources found mode.

Background checks disclose candidate title IDs to installed providers earlier than today's details-only flow. Explain this next to the mode: “Checking sources sends movie requests to your installed addons.” Start checks only when the user enables the mode or requests an individual check. Do not probe video URLs, download media, initiate playback, or contact uninstalled addons to verify availability. Keep addon configuration URLs and credentials out of logs and analytics; use an opaque in-memory configuration revision for invalidation.

## Repository changes and delivery order

This proposal is kept in one place. Do not make documentation-only copies in every repository.

| Repository | Implementation work after design agreement |
| --- | --- |
| **stremio-core** | Add independent availability state, request scheduling, result classification, bounded in-memory caching, and runtime messages. Reuse manifest matching and metadata/stream resolution. Add unit tests. Extend the WASM model serialization and bridge in this same repository. |
| **stremio-translations** | Add approved labels, explanations, progress pluralization, retry text, and accessibility announcements. |
| **stremio-web** | Consume the released core bridge, add Discover controls and status presentation, preserve focus/scroll state, improve the details empty state, and connect navigation to fresh availability results. Update the translation dependency after the keys land. |
| **stremio-addon-sdk** | No required change for the initial version: use existing metadata and stream resources. A future batch availability protocol would need a separate proposal and addon adoption. |
| **stremio-video / desktop shells / other clients** | No assumed change for this first web implementation. Reuse existing playback capability behavior. Native clients need separate UI adoption; a shared-core change alone does not deliver this experience everywhere. |

Suggested implementation sequence:

1. Agree on state meanings, request budget, and privacy behavior in this draft.
2. Implement and test the core coordinator and WASM representation behind an unused interface. Keep existing clients compatible and keep state in memory; if persistence is introduced later, follow core schema migration requirements.
3. Land translations and release the core bridge. Integrate the Discover movie mode and the improved empty-state recovery path in web.
4. Verify with controlled addons and measure request volume before wider rollout.
5. Extend the same model to Board and Search. Do not describe the initial Discover-only version as solving every browsing surface.

For the first release, scope the filter to movies whose video identity can be resolved. For series, source availability belongs to an episode. Never mark an entire series unavailable because one episode has no streams. A follow-up can check the selected or next unwatched episode and show “Sources found for episode 3,” with an explicit episode scope. Unknown/custom content types remain browsable in All titles.

## Acceptance and verification

Use controlled addon fixtures for available streams, empty streams, embedded sources, external links, unsupported sources, errors, timeouts, and delayed responses. Live third-party addons are unsuitable as the sole test oracle.

| Scenario | Required result |
| --- | --- |
| One addon returns a supported source; another fails | The movie appears with Sources found. |
| Every relevant provider completes with an empty result | The movie is omitted from Sources found mode; All titles explains the empty result. |
| One provider returns empty and another times out | Could not check sources; never No sources found. |
| A movie has a source embedded in metadata | It is recognized without requiring a separate stream-resource provider. |
| A response contains only trailers, external links, or unsupported actions | It does not appear as an in-app source match. External/unsupported information remains available in All titles. |
| No source provider matches, but metadata has not resolved | Do not conclude No matching provider yet. |
| No source matches in the current batch | Stop at the budget and offer Check more; do not fetch the whole catalog. |
| Catalog pages are empty or repeat IDs | Stop at the page budget, deduplicate candidates, and keep pagination under user control. |
| User opens a movie while its check is running | Reuse relevant work without replacing the selected details model or doubling requests. |
| User goes back from an empty details page | Preserve location and retain the recent result so the same card explains the outcome. |
| User changes addons/account while checks are running | Old results cannot populate the new configuration's state. |
| A positive cache entry expires or the platform changes | Recheck before including the movie as a current source match. |
| User leaves Discover | No new background work is scheduled; stale completions cannot change the next screen. |
| Checks finish during keyboard navigation | Focus remains stable; state is conveyed in text, not color alone. |
| One episode has no source | Other episodes and the series are not labeled unavailable. |

Core validation should cover classification precedence, request caps, deduplication, generation invalidation, expiry, and embedded-source handling using the existing unit-test infrastructure. Run core formatting, clippy, tests, and the WASM build for the implementation.

For web implementation, follow the repository's test-file policy, run lint, existing tests, translation scanning, and a production build. Manually exercise desktop and narrow layouts, keyboard navigation, back navigation, offline recovery, and addon reconfiguration. Include screenshots or a recording in the implementation PR. Record observed request counts against the stated budgets.

The implementation and its validation are tracked separately in the [review guide](../source-check-review.md). The acceptance table above describes the complete proposal, including work not yet implemented.

## Related discussion and decisions needed

- [Movie size and no streams filter, stremio-features #67](https://github.com/Stremio/stremio-features/issues/67) includes the same filtering request. It is closed as completed, but has no comments establishing an implementation for this behavior in the inspected web revision.
- [Streaming workflow proposal, stremio-features #1514](https://github.com/Stremio/stremio-features/issues/1514) is closed as not planned. This proposal is narrower: source discovery before navigation, without bandwidth tests, automatic source selection, or content notifications.

Maintainer decisions: Is Discover movies an acceptable first scope? Are the opt-in background requests and proposed limits acceptable to addon operators? Should availability state be a separate core model or part of existing catalog models? Which existing capability checks should define a supported playback action across web and desktop environments?

The intended outcome is straightforward: users should have a way to choose movies with known sources and a useful explanation when none were found, instead of repeatedly navigating into the same empty screen.

// Copyright (C) 2017-2026 Smart code 203358507

/** @type {import('stylelint').Config} */
module.exports = {
    extends: ['stylelint-config-recommended'],
    customSyntax: 'postcss-less',
    rules: {
        // CSS Modules :global, :local, :import pseudo-classes.
        'selector-pseudo-class-no-unknown': [true, {
            ignorePseudoClasses: ['global', 'local', 'import'],
        }],
        // CSS Modules `composes:` and `@value`, Less syntax.
        'at-rule-no-unknown': null,
        'at-rule-prelude-no-invalid': null,
        'property-no-unknown': null,
        // Less variables appear inside media queries (@{minimum} etc.).
        'media-query-no-invalid': null,
        // Less tilde imports (~pkg/file.less) and `@import (reference)`
        // are valid in the webpack + less-loader setup.
        'no-invalid-position-at-import-rule': null,
        // :global(...) wrappers naturally create specificity inversions
        // and duplicate selectors compared with the scoped local class.
        'no-descending-specificity': null,
        'no-duplicate-selectors': null,
        // The repo uses short-hex (#fff) and long-hex (#ffffff)
        // interchangeably; mixed notation is intentional.
        'color-hex-length': null,
        'color-function-notation': null,
        'alpha-value-notation': null,
        // Less variable interpolation (@{var}) trips generic rules.
        'function-no-unknown': null,
        // Fallback property declarations (e.g. `display: -webkit-box`
        // then `display: flex`) are intentional.
        'declaration-block-no-duplicate-properties': null,
        // Empty rule blocks are used as composition placeholders.
        'block-no-empty': null,
        // Less variables in calc() / property values (e.g. `calc(@x / 2)`)
        // can't be statically validated. A handful of real bugs are also
        // hiding behind this rule (`font-size: 500` looks like a misplaced
        // font-weight, `background-color: none` should probably be
        // `transparent`) — flag these as follow-up work rather than
        // enforcing here, where we just want a green baseline.
        'declaration-property-value-no-unknown': null,
        // Kebab-case class names are fine as-is.
        'selector-class-pattern': null,
    },
    ignoreFiles: [
        'build/**',
        'node_modules/**',
    ],
};

module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "arrow-parens": "error",
        "arrow-spacing": "error",
        "block-spacing": "error",
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "func-call-spacing": [
            "error",
            "never"
        ],
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "no-console": [
            "error",
            {
                allow: ["error"]
            }
        ],
        "no-extra-semi": "error",
        "no-eq-null": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-template-curly-in-string": "error",
        "no-trailing-spaces": "error",
        "no-useless-concat": "error",
        "no-unreachable": "error",
        "no-unused-vars": "error",
        "prefer-const": "error",
        "quotes": [
            "warn",
            "single"
        ],
        "react/prop-types": 0,
        "semi": [
            "error",
            "always"
        ],
        "semi-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "space-before-blocks": "error",
        "valid-typeof": "error"
    },
    "env": {
        "node": true,
        "browser": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 9,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    }
}

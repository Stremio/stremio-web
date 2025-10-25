# Contributing to Stremio Web

First off, thank you for considering contributing to Stremio Web! It's people like you that make Stremio Web such a great app.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Getting Started

### Prerequisites

- **Node.js:** This project uses a specific version of Node.js. Please use a version manager like `nvm` to ensure you are using the correct version.
  ```sh
  nvm use
  ```
- **pnpm:** This project uses `pnpm` as its package manager. Please do not use `npm` or `yarn`. You can install `pnpm` with:
  ```sh
  npm install -g pnpm
  ```

### Installation

1.  **Fork the repository:** Fork the project to your own GitHub account.
2.  **Clone your fork:**
    ```sh
    git clone https://github.com/YOUR_USERNAME/stremio-web.git
    ```
3.  **Navigate to the project directory:**
    ```sh
    cd stremio-web
    ```
4.  **Install dependencies:**
    ```sh
    pnpm install
    ```
5.  **Run the development server:**
    ```sh
    pnpm start
    ```

## Code Style & Linting

To ensure code consistency, we use **ESLint**. Before submitting a pull request, please make sure your code adheres to the project's linting rules.

You can run the linter with the following command:

```sh
pnpm run lint
```

Any pull request with linting errors will not be merged.

## Branching & Pull Request Process

We have a structured process for submitting pull requests to ensure a clear and organized workflow.

**All pull requests must target the `development` branch.**

### Branch Naming Convention

Your branch name should follow this convention:

-   `feature/<brief-description>` for new features (e.g., `feature/add-skip-intro-button`)
-   `fix/<issue-number-or-bug>` for bug fixes (e.g., `fix/123-library-loading-bug`)
-   `chore/<housekeeping-task>` for maintenance tasks (e.g., `chore/update-dependencies`)

### Pull Request Titles

PR titles must follow the **Conventional Commits** specification. This helps us automate changelogs and clearly document changes.

Examples:
-   `feat: Add user profile page`
-   `fix: Resolve issue with video player crashing`
-   `docs: Update CONTRIBUTING.md guide`
-   `chore: Refactor state management module`

### Pull Request Descriptions

Your PR description **must** link to the issue it resolves. Use keywords like `Closes` or `Fixes` to automatically close the corresponding issue when the PR is merged.

Example:
```
This PR introduces a new settings panel for subtitles.

Closes #456
```

## Issue Reporting

-   **Bug Reports:** Please use the "Bug Report" template when creating a new issue.
-   **Feature Requests:** For new ideas, please use the "Feature Request" template.

Thank you for your contribution!

# Change Log

All notable changes to the "net-secrets-manager" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] - 2026-11-11

### Added

- Rename projects directly from the configured secrets list, useful when a project only shows its UserSecretsId.
- Activate environments directly from the configured secrets list.
- Secrets are shown as syntax-highlighted JSON with values hidden by default, a per-value show/hide toggle and copy button, a show/hide all toggle, and a "Copy JSON" button.
- Delete environments from the configured secrets list and from the project panel, with confirmation. The active environment and the last remaining environment cannot be deleted.

### Fixed

- Language links and images in the README now work on the VS Code Marketplace.

### Changed

- README in all languages documents project renaming, environment activation and deletion, and the new secrets view.

## [0.0.12]

- Initial release

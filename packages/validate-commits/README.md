# @bigcommerce/validate-commits

This is a tool for validating commit messages - to ensure they have a consistent format and the required information.

## Installation

```sh
npm install --save-dev @bigcommerce/validate-commits
```

## Usage

Your commit message needs to have the following format:

```
task(scope): JIRA-1234 My commit message
```

You might also want to include a message body to provide additional information, for example, a breaking change.

```
task(scope): JIRA-1234 My commit message

BREAKING CHANGE: ABC has been renamed to XYZ.
```

### Tasks

Below is a list of supported tasks:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scopes

You need to add `commit-validation.json` to the root of your project in order to configure a list of supported scopes. i.e.:

```json
{
    "scopes": [
        "payment",
        "checkout",
        "orders"
    ]
}
```

### CLI

To run the validator in Terminal:

```sh
npx validate-commits
```

## Requirements

* Node: `>=6`

## License

MIT

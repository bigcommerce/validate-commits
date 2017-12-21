# Commit Validation

To use it:

### 1. Install the package in your repo:
> `npm install --save git+https://git@github.com/bigcommerce-labs/validate-commits.git`

### 2. Add a `commit-validation.json` in the root of your project:

```json
{
    "scopes": [
        "payment",
        "checkout",
        "orders"
    ]
}
```

Optionally, you might want to validate your commit messages against a set of custom patterns.

```json
{
    "patterns": [
        "^Releasing \\d+\\.\\d+\\.\\d+$"
    ],
}
```

Please note that your patterns, by design, will not override the default patterns.

### 3. Add the check to one of your tasks in `package.json`:

```js
"pretravis": "validate-commits",
"travis": "gulp travis --coverage",
```

or run it manually: `./node_modules/.bin/validate-commits`

Enjoy!

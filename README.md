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

### 3. Add the check to one of your tasks in `package.json`:

```js
"pretravis": "validate-commits",
"travis": "gulp travis --coverage",
```

or run it manually: `./node_modules/.bin/validate-commits`

Enjoy!

## License

MIT

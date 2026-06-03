# Love Court - E2E Testing

End-to-end tests using Playwright for the Love Court app.

## Setup

Install dependencies:
```bash
npm install
npx playwright install chromium
```

## Running Tests

### Development (with dev server)
```bash
npm run e2e
# or
npx playwright test
```

### Specific browsers
```bash
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

### With custom URL
```bash
BASE_URL=https://your-site.com npx playwright test
```

## Test Coverage

- **Landing Page**: Title display, navigation
- **Partner A Form**: Validation, submission, errors
- **Partner B Form**: Summary viewing, response
- **Verdict Page**: Verdict display, navigation
- **History Page**: Loading, case listing

## Devices Tested

| Viewport | Size | Project |
|----------|------|---------|
| Desktop | 1920×1080 | Desktop Chrome |
| Tablet | 768×1024 | iPad Pro 11 |
| Mobile | 375×667 | Pixel 5 |

## CI Integration

```yaml
# .github/workflows/test.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install chromium
      - run: npx playwright test
        env:
          CI: true
```

## Debugging

```bash
# Show trace on failure
npx playwright test --trace on

# UI mode
npx playwright test --ui

#headed mode
npx playwright test --headed
```

## Reports

HTML report generated at `playwright-report/`. Upload to GitHub Artifacts:
```bash
npx playwright show-report
```
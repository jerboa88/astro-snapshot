# 🤝 Contributing

Thank you for your interest in contributing to Astro Snapshot! This guide will help you get started.

## Getting Started

1. **Fork the repository** and clone it locally:
   ```bash
   git clone https://github.com/your-username/astro-snapshot.git
   cd astro-snapshot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Create a branch** for your changes:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Local Testing

To test your changes in a local Astro project:

1. Build the integration:
   ```bash
   npm run build
   ```

2. Link the package locally:
   ```bash
   npm link
   ```

3. In your test Astro project:
   ```bash
   npm link astro-snapshot
   ```

4. Configure and test the integration in your Astro project

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

## Code Style

- Use TypeScript for all new code
- Add TSDoc comments for public APIs
- Follow the existing code style
- Ensure your code passes linting:
  ```bash
  npm run lint
  ```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear version management:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions or changes
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: add support for AVIF format"
git commit -m "fix: handle missing output directory gracefully"
git commit -m "docs: update README with new examples"
```

For breaking changes, add a `!` after the type:
```bash
git commit -m "feat!: change default output directory structure"
```

## Pull Request Process

1. **Update documentation** if you've changed APIs
2. **Add tests** for new functionality
3. **Update the README** with details of changes if needed
4. **Ensure all tests pass**
5. **Update type definitions** if you've changed the API
6. **Submit your PR** with a clear description of changes

### PR Title Format

Follow the same conventions as commit messages:

- `feat: add WebP quality option`
- `fix: correctly handle relative paths`
- `docs: improve troubleshooting section`

## Testing Checklist

Before submitting a PR, please ensure:

- [ ] Basic screenshot generation works
- [ ] Multiple screenshots per page work
- [ ] Different output formats (PNG, JPEG, WebP) work
- [ ] Custom dimensions are applied correctly
- [ ] Puppeteer options are passed through properly
- [ ] Build completes without errors
- [ ] TypeScript types are correct

## Reporting Issues

When reporting issues, please include:

1. **Astro version** and **astro-snapshot version**
2. **Minimal reproduction** code
3. **Error messages** or unexpected behavior
4. **Expected behavior**
5. **Your environment** (OS, Node version)

## Feature Requests

Feature requests are welcome! Please:

1. **Check existing issues** first
2. **Provide use cases** for the feature
3. **Consider implementation complexity**
4. **Be open to alternatives**

## Questions?

Feel free to:

- Open an issue for questions
- Start a discussion in the repository
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

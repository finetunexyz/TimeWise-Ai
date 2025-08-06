# Contributing to TimeWise

Thank you for your interest in contributing to TimeWise! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- A modern web browser
- Basic knowledge of React, TypeScript, and Express.js

### Local Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/your-username/timewise.git
cd timewise
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5000`

## 🏗️ Project Structure

```
timewise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared types and schemas
├── browser-extension/      # Browser extension code
└── README.md
```

## 🎯 How to Contribute

### 1. Choose an Issue
- Browse [open issues](https://github.com/username/timewise/issues)
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to let others know you're working on it

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes
- Follow the coding standards outlined below
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 4. Submit a Pull Request
- Push your branch to your fork
- Create a pull request with a clear description
- Link to the issue you're addressing
- Wait for review and address feedback

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use strict type checking

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper TypeScript props interfaces
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes
- Follow the existing dark mode theme
- Ensure responsive design
- Use shadcn/ui components when available

### Backend
- Follow RESTful API conventions
- Use proper error handling
- Validate input with Zod schemas
- Write clear, documented endpoints

## 🧪 Testing

### Manual Testing
- Test all user flows thoroughly
- Verify dark mode appearance
- Check responsive design on different screen sizes
- Test browser extension functionality

### Automated Testing
```bash
npm run type-check    # TypeScript type checking
npm run lint          # ESLint linting
npm run build         # Build verification
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- Browser: [e.g. Chrome 91]
- OS: [e.g. macOS 11.4]
- Node.js: [e.g. 18.16.0]
```

## 💡 Feature Requests

When suggesting features:

1. **Use Case**: Explain why this feature would be useful
2. **Description**: Detailed description of the proposed feature
3. **Implementation Ideas**: Any thoughts on how it could work
4. **Alternatives**: Alternative solutions you've considered

## 🔧 Browser Extension Development

### Testing the Extension
1. Build the extension files
2. Load unpacked extension in Chrome (`chrome://extensions/`)
3. Test all functionality including notifications
4. Verify data persistence and settings

### Extension Guidelines
- Follow Manifest V3 standards
- Minimize permissions requested
- Ensure cross-browser compatibility
- Test notification timing and frequency

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project standards
- [ ] Changes are thoroughly tested
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive

### Pull Request Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All existing functionality works
- [ ] New functionality works as expected

## Screenshots
If applicable, add screenshots of your changes.
```

## 🏷️ Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer description if needed.

Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Maintenance tasks

### Examples
```bash
feat(notifications): add weekend notification toggle
fix(dashboard): resolve category filtering issue
docs(readme): update installation instructions
style(ui): improve dark mode contrast
```

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional environment

### Unacceptable Behavior
- Harassment or discrimination
- Personal attacks or trolling
- Publishing private information
- Spam or off-topic discussions

## 🆘 Getting Help

If you need help:

1. **Check existing issues** for similar problems
2. **Read the documentation** thoroughly
3. **Ask in GitHub Discussions** for general questions
4. **Create an issue** for bugs or feature requests

### Community Resources
- [GitHub Issues](https://github.com/username/timewise/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/username/timewise/discussions) - General questions and ideas
- [README.md](README.md) - Project overview and setup

## 📜 License

By contributing to TimeWise, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Optional: Contributors section in README

Thank you for helping make TimeWise better! 🎉
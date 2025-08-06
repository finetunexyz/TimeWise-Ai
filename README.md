# TimeWise - Smart Hourly Check-ins

<div align="center">

![TimeWise Logo](https://via.placeholder.com/128x128/3b82f6/ffffff?text=TW)

**Smart hourly check-ins that visualize your day, track your productivity, and help you make every hour count.**

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/username/timewise)](https://github.com/username/timewise/issues)
[![GitHub stars](https://img.shields.io/github/stars/username/timewise)](https://github.com/username/timewise/stargazers)

[🌐 Live Demo](https://your-deployment-url.replit.app) • [📱 Browser Extension](#browser-extension) • [📊 Features](#features) • [🚀 Getting Started](#getting-started)

</div>

## ✨ Features

### 🕐 Smart Hourly Notifications
- **Browser notifications** every hour during work hours
- **Customizable work schedule** (weekdays, weekends, specific hours)
- **Smart reminders** that respect your settings and preferences
- **Sound notifications** with optional audio alerts

### 📊 Activity Tracking
- **Quick activity logging** with category-based organization
- **Smart categorization** based on keywords and context
- **Time range selection** with 30-minute intervals
- **Automatic URL tracking** to understand work context

### 📈 Analytics & Insights
- **24-hour visualization** with interactive charts and timeline view
- **Category breakdown** showing time distribution across different activities
- **Productivity scoring** based on work vs. leisure time
- **Daily, weekly, and monthly** activity summaries

### 🎨 Modern Dark UI
- **Dark mode design** optimized for extended use
- **Responsive interface** that works on desktop and mobile
- **Intuitive navigation** with clean, professional design
- **Accessibility features** for inclusive user experience

### 🔧 Flexible Deployment
- **Web Application** - Full-featured dashboard accessible anywhere
- **Browser Extension** - Quick activity logging without leaving your current page
- **Local or Cloud** - Deploy on Replit, GitHub Pages, or your own server

## 🚀 Getting Started

### Web Application

#### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- Optional: PostgreSQL database (falls back to in-memory storage)

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/username/timewise.git
cd timewise
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the application**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5000` to start using TimeWise!

### Browser Extension

#### Installation

1. **Download the extension**
   - Download the `browser-extension` folder from this repository
   - Or build it from source using the web application

2. **Install in Chrome/Edge**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `browser-extension` folder

3. **Install in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `browser-extension` folder

#### Usage
- Click the TimeWise icon in your browser toolbar
- Log activities when prompted by hourly notifications
- Access settings to customize notification preferences
- View daily summaries directly in the popup

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for robust UI development
- **Tailwind CSS** + **shadcn/ui** for modern, accessible components
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Chart.js** for data visualization

### Backend
- **Express.js** with TypeScript for API development
- **RESTful architecture** with clear separation of concerns
- **In-memory storage** for fast prototyping (PostgreSQL support available)
- **Keyword-based categorization** system

### Browser Extension
- **Manifest V3** for modern Chrome extension compatibility
- **Service Worker** background script for reliable notifications
- **Content Script** integration for enhanced page context
- **Local Storage** for offline activity tracking

## 📱 Browser Extension Features

### 🔔 Smart Notifications
- Hourly reminders during your configured work hours
- Weekend notification controls
- Context-aware suggestions based on current website
- One-click activity logging without disrupting workflow

### 🎯 Quick Logging
- **Popup interface** for fast activity entry
- **Auto-categorization** based on current website and description
- **Recent activities** for quick re-logging
- **Duration presets** for common time intervals

### 📊 Mini Dashboard
- **Today's summary** showing time distribution
- **Category breakdown** with visual indicators
- **Quick access** to full web dashboard
- **Settings panel** for notification preferences

### 🔗 Context Awareness
- **URL tracking** to understand work patterns
- **Smart suggestions** for activity categories
- **Page title analysis** for better activity descriptions
- **Work site detection** for automatic work categorization

## 🛠️ Configuration

### Environment Variables
```bash
# Optional: Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/timewise

# Optional: External service integrations
OPENAI_API_KEY=your_openai_key_here

# Development settings
NODE_ENV=development
PORT=5000
```

### Settings Options
- **Work Hours**: Customize start/end times for notifications
- **Weekend Notifications**: Enable/disable weekend reminders
- **Sound Alerts**: Toggle audio notifications
- **Categorization**: Adjust automatic activity categorization
- **Data Export**: Export your activity data as JSON or CSV

## 📊 Data Structure

### Activity Schema
```typescript
interface Activity {
  id: string;
  description: string;
  category: 'work' | 'personal' | 'health' | 'learning' | 'leisure' | 'other';
  duration: number; // in hours
  startTime: Date;
  endTime: Date;
  url?: string; // from browser extension
  createdAt: Date;
}
```

### Categories
- **Work**: Professional tasks, meetings, coding, emails
- **Personal**: Family time, errands, personal projects
- **Health**: Exercise, medical appointments, wellness activities
- **Learning**: Education, courses, reading, skill development
- **Leisure**: Entertainment, hobbies, relaxation
- **Other**: Miscellaneous activities

## 🔒 Privacy & Security

TimeWise is designed with privacy in mind:

- **Local-first approach**: Data can be stored entirely locally
- **No tracking**: We don't collect analytics or personal data
- **Open source**: Full transparency with source code available
- **Minimal permissions**: Browser extension only requests necessary permissions
- **Data ownership**: You control where and how your data is stored

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to your fork**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Test on multiple browsers for extension features

## 📝 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics**: Weekly/monthly reports and trends
- [ ] **Goal Setting**: Daily and weekly productivity targets
- [ ] **Team Features**: Shared workspaces and collaboration
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Integrations**: Calendar, Slack, and project management tools
- [ ] **AI Insights**: Enhanced productivity recommendations
- [ ] **Offline Mode**: Full offline functionality with sync

### Browser Extension Enhancements
- [ ] **Firefox and Safari** support
- [ ] **Automatic time tracking** based on active application
- [ ] **Meeting detection** from calendar integrations
- [ ] **Focus mode** with website blocking capabilities
- [ ] **Pomodoro timer** integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Replit** for providing an excellent development platform
- **shadcn/ui** for beautiful, accessible UI components
- **The open source community** for inspiring this project

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/username/timewise/issues)
- **Documentation**: Check the wiki for detailed guides
- **Community**: Join discussions in GitHub Discussions

---

<div align="center">

**Made with ❤️ for productivity enthusiasts**

[⭐ Star this repo](https://github.com/username/timewise) • [🐛 Report Bug](https://github.com/username/timewise/issues) • [💡 Request Feature](https://github.com/username/timewise/issues)

</div>
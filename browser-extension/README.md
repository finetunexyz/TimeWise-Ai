# TimeWise Browser Extension

A smart time tracking browser extension that provides hourly check-ins and productivity insights.

## Features

- **Hourly Notifications**: Smart reminders during work hours
- **Quick Activity Logging**: Fast activity entry without leaving your current page
- **Auto-categorization**: Intelligent suggestions based on current website
- **Context Awareness**: URL and page title tracking for better insights
- **Offline Storage**: Local data storage with sync capabilities
- **Dark Mode UI**: Professional dark theme optimized for productivity

## Installation

### From Source (Developer Mode)

1. **Download or clone this repository**
2. **Open your browser's extension management page**:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Firefox: `about:debugging#/runtime/this-firefox`

3. **Enable Developer Mode** (Chrome/Edge only)
4. **Load the extension**:
   - Chrome/Edge: Click "Load unpacked" and select the `browser-extension` folder
   - Firefox: Click "Load Temporary Add-on" and select `manifest.json`

### Required Icons

Before loading the extension, make sure to add icon files in the `icons/` folder:
- `icon-16.png` (16x16px)
- `icon-32.png` (32x32px) 
- `icon-48.png` (48x48px)
- `icon-128.png` (128x128px)

See `icons/create-icons.md` for design guidelines.

## Usage

### First Time Setup

1. Click the TimeWise icon in your browser toolbar
2. Configure your work hours in Settings
3. Enable notifications when prompted
4. Start logging activities when notified

### Daily Workflow

1. **Receive hourly notifications** during your configured work hours
2. **Click the extension icon** to quickly log what you've been working on
3. **Select category and duration** - the extension will auto-suggest based on context
4. **View daily summary** in the popup to track your progress

### Settings

Access settings by clicking the gear icon in the extension popup:

- **Hourly Reminders**: Enable/disable notifications
- **Work Hours**: Set your typical work schedule
- **Weekend Notifications**: Control weekend reminders
- **Sound Notifications**: Toggle audio alerts

## Privacy & Data

- **Local Storage**: All data is stored locally in your browser
- **No External Servers**: The extension doesn't send data to external services
- **URL Tracking**: Only stores URLs for context, not browsing history
- **Minimal Permissions**: Only requests necessary browser permissions

## Permissions Explained

- **Notifications**: For hourly activity reminders
- **Storage**: To save your activities and settings locally
- **Active Tab**: To get current page context for better categorization
- **Alarms**: To schedule hourly notifications

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Background**: Service Worker for reliable notifications
- **Content Scripts**: Page context detection
- **Popup**: React-like vanilla JS interface
- **Storage**: Chrome Storage API for data persistence

## Development

### File Structure
```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for notifications
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Page context detection
└── icons/                # Extension icons
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

### Building for Distribution

1. Ensure all icon files are present
2. Test in developer mode across different browsers
3. Package as ZIP file for store submission
4. Follow browser-specific store guidelines

## Browser Compatibility

- ✅ **Chrome**: Full support (Manifest V3)
- ✅ **Edge**: Full support (Chromium-based)
- ⚠️ **Firefox**: Requires Manifest V2 conversion for full support
- ⚠️ **Safari**: Requires Safari Web Extension conversion

## Troubleshooting

### Notifications Not Working
1. Check if browser notifications are enabled
2. Verify work hours are set correctly
3. Ensure the extension has notification permissions

### Data Not Saving
1. Check if the extension has storage permissions
2. Try reloading the extension
3. Clear extension data and reconfigure

### Context Detection Issues
1. Ensure content script permissions are granted
2. Refresh pages after installing the extension
3. Check browser console for error messages

## Integration with Web App

This extension can work alongside the main TimeWise web application:

1. **Export Data**: Use the extension's export feature
2. **Import to Web App**: Upload exported data to your web dashboard
3. **Sync Setup**: Configure both to use the same data format

## Contributing

To contribute to the browser extension:

1. Follow the main repository's contribution guidelines
2. Test changes across multiple browsers
3. Ensure privacy and security best practices
4. Update documentation as needed

## Support

For issues specific to the browser extension:
- Check the main repository's issue tracker
- Include browser version and extension version in reports
- Provide console logs if available
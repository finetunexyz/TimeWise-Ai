# Browser Extension Icons

To complete the browser extension setup, you'll need to create icon files in the following sizes:

- `icon-16.png` (16x16 pixels) - Toolbar icon
- `icon-32.png` (32x32 pixels) - Extension management
- `icon-48.png` (48x48 pixels) - Extension management and notifications  
- `icon-128.png` (128x128 pixels) - Chrome Web Store and installation

## Icon Design Guidelines

### Design Concept
- **Primary Color**: #3b82f6 (blue)
- **Background**: Dark (#1e293b) or transparent
- **Style**: Modern, minimal clock/time icon
- **Format**: PNG with transparency

### Suggested Icon Elements
- Clock face with hour markers
- Optional: "TW" text overlay
- Clean, readable design at small sizes
- Consistent with the TimeWise brand

### Tools for Creating Icons
- **Figma/Sketch**: For vector-based design
- **Canva**: For quick icon creation
- **Online generators**: Search "browser extension icon generator"
- **AI tools**: Use DALL-E or similar for icon generation

### Quick SVG Template
You can convert this SVG to PNG at different sizes:

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#1e293b"/>
  <circle cx="64" cy="64" r="32" stroke="#3b82f6" stroke-width="4" fill="none"/>
  <line x1="64" y1="64" x2="64" y2="44" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <line x1="64" y1="64" x2="76" y2="76" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <text x="64" y="100" font-family="Arial, sans-serif" font-size="12" fill="#60a5fa" text-anchor="middle">TW</text>
</svg>
```

Once you have the icons, place them in this `icons/` folder to complete the extension setup.
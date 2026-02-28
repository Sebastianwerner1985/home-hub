# Design System Integration

This app uses the centralized design system from `/Users/d056488/Claude-Projects/apps/design-system/`.

## Synced Files

The following files are synced from the central design system:

- `static/css/snowui-tokens.css` - Design tokens (colors, spacing, typography)
- `static/css/snowui-components.css` - Component styles (buttons, cards, forms, etc.)
- `static/icons/icon.svg` - App icon

## How to Update

To update the design system files in this app, run the sync script:

```bash
cd ~/Claude-Projects/apps
./DESIGN_SYSTEM_SYNC.sh
```

This script will automatically sync the latest design system files to all apps, including home-hub.

## Design System Location

Central design system: `/Users/d056488/Claude-Projects/apps/design-system/`

The sync script is located at: `/Users/d056488/Claude-Projects/apps/DESIGN_SYSTEM_SYNC.sh`

## Using the Design System

Include the CSS files in your HTML templates:

```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/snowui-tokens.css') }}">
<link rel="stylesheet" href="{{ url_for('static', filename='css/snowui-components.css') }}">
```

This provides access to:
- CSS custom properties for colors, spacing, typography
- Pre-styled components with consistent design
- Responsive and accessible UI elements

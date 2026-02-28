# Home Hub - Smart Home Dashboard

A central landing page that provides unified access to all smart home monitoring and control applications.

## Overview

Home Hub serves as the main entry point for your home automation ecosystem, providing:
- Quick access to all installed applications
- Real-time status monitoring of services
- Unified design system across all apps
- Responsive design for desktop and mobile devices

## Features

- **App Cards**: Visual cards for each application with status indicators
- **Status Monitoring**: Real-time checks to verify all services are online
- **Dark/Light Theme**: Toggle between dark and light modes with persistent storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SnowUI Design System**: Consistent design language across all applications

## Connected Applications

### Energy Dashboard (Port 5002)
Real-time energy consumption monitoring with:
- Live power usage tracking
- Historical usage patterns
- Cost analysis and reporting
- Interactive charts and visualizations

### Heizung Tracker (Port 5001)
Oil heating system monitor with:
- Oil consumption tracking
- Burner start and operating hours monitoring
- Heating cost analysis
- Weather correlation insights

### ML Training (Port 5000)
Machine learning model training for:
- Automatic oil meter reading
- Image capture and labeling
- Training dataset management
- Computer vision model development

## Installation

### Prerequisites

- Python 3.8 or higher
- Flask web framework
- SnowUI design system files

### Setup

1. Clone or navigate to the home-hub directory:
```bash
cd /Users/d056488/Claude-Projects/apps/home-hub
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Verify design system files are in place:
```bash
ls static/css/snowui-*.css
```

4. Run the application:
```bash
python app.py
```

5. Access the dashboard at:
```
http://localhost:8080
```

## Deployment

### Raspberry Pi Deployment

1. Transfer files to the Pi:
```bash
scp -r home-hub/ bstiwrnr@192.168.178.100:/home/bstiwrnr/
```

2. SSH into the Pi:
```bash
ssh bstiwrnr@192.168.178.100
```

3. Create systemd service file `/etc/systemd/system/home-hub.service`:
```ini
[Unit]
Description=Home Hub Landing Page
After=network.target

[Service]
Type=simple
User=bstiwrnr
WorkingDirectory=/home/bstiwrnr/home-hub
ExecStart=/usr/bin/python3 /home/bstiwrnr/home-hub/app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

4. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable home-hub
sudo systemctl start home-hub
```

5. Check service status:
```bash
sudo systemctl status home-hub
```

6. Access the dashboard at:
```
http://192.168.178.100:8080
```

## Directory Structure

```
home-hub/
├── app.py                      # Flask application
├── requirements.txt            # Python dependencies
├── static/                     # Static assets
│   ├── css/                    # Stylesheets
│   │   ├── snowui-tokens.css   # Design tokens
│   │   └── snowui-components.css # UI components
│   ├── icons/                  # Application icons
│   ├── images/                 # Images and graphics
│   └── js/                     # JavaScript files
└── templates/                  # HTML templates
    └── index.html              # Landing page
```

## Technology Stack

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design System**: SnowUI (custom design system)
- **Fonts**: Inter (Google Fonts)
- **Theme**: Dark mode by default with light mode toggle

## Configuration

### Port Configuration

The default port is 8080. To change it, edit `app.py`:

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

### Application URLs

Update application URLs in `templates/index.html` if your services run on different ports or hosts:

```javascript
checkAppStatus('http://192.168.178.100:5002', 'energy-status', 'energy-status-text');
checkAppStatus('http://192.168.178.100:5001', 'heizung-status', 'heizung-status-text');
checkAppStatus('http://192.168.178.100:5000', 'ml-status', 'ml-status-text');
```

## Development

### Local Testing

```bash
python app.py
```

Visit `http://localhost:8080` in your browser.

### Design System Updates

When updating the SnowUI design system:

1. Copy updated CSS files to `static/css/`:
```bash
cp ../design-system/snowui-*.css static/css/
```

2. Restart the Flask application

## Maintenance

### View Logs

If running as a systemd service:
```bash
sudo journalctl -u home-hub -f
```

### Restart Service

```bash
sudo systemctl restart home-hub
```

### Check Service Status

```bash
sudo systemctl status home-hub
```

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, change the port in `app.py` or stop the conflicting service:

```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Status Indicators Show Offline

- Verify all connected applications are running
- Check network connectivity to the Raspberry Pi
- Verify firewall settings allow connections on the required ports
- Check application logs for errors

### Design System Not Loading

- Verify CSS files exist in `static/css/`
- Check browser console for 404 errors
- Clear browser cache and reload

## License

This is a private project for personal home automation use.

## Version

Current version: 1.0.0

## Author

Created as part of the smart home automation ecosystem.

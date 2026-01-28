#!/bin/bash
# Setup PM2 to start on system boot

echo "🚀 Setting up PM2 to auto-start on boot..."

# Install pm2 globally if not already installed
sudo npm install -g pm2

# Start the daemon
npm run daemon

# Setup PM2 to start on boot
pm2 startup
pm2 save

echo "✅ PM2 daemon setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run daemon           - Start the daemon"
echo "  npm run daemon:stop      - Stop the daemon"
echo "  npm run daemon:restart   - Restart the daemon"
echo "  npm run daemon:logs      - View live logs"
echo "  npm run daemon:delete    - Delete the daemon"
echo ""
echo "🔄 The app will auto-restart if it crashes or when files change"

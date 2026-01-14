#!/bin/bash
# Quick script to find your local IP address for testing on iPhone
# Run with: bash get-ip.sh

IP=$(ifconfig 2>/dev/null | grep -E "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

# Alternative for newer systems
if [ -z "$IP" ]; then
    IP=$(ip addr show 2>/dev/null | grep -E "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -1)
fi

if [ -n "$IP" ]; then
    echo ""
    echo "========================================="
    echo "Your Local IP Address: $IP"
    echo "========================================="
    echo ""
    echo "Frontend URL: http://$IP:3000"
    echo "Backend URL:  http://$IP:4000"
    echo ""
    echo "To test on iPhone:"
    echo "1. Make sure iPhone and computer are on the same Wi-Fi"
    echo "2. Open Safari on iPhone and go to: http://$IP:3000"
    echo "3. Use: npm run dev:network (in frontend folder) to allow network access"
    echo ""
else
    echo "Could not find IP address. Make sure you're connected to Wi-Fi."
fi














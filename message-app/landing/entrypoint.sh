#!/bin/sh

# Create env.js with environment variables
cat > /usr/share/nginx/html/env.js << 'EOF_MARKER'
window.env = {
EOF_MARKER

cat >> /usr/share/nginx/html/env.js << EOF
  API_URL: "${BACKEND_URL:-http://localhost:3002}",
  GAME_URL: "${GAME_URL:-http://localhost:8080}"
};
EOF

# Execute the passed command (nginx)
exec "$@"

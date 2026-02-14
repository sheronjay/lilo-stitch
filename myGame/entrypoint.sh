#!/bin/sh

# Create env.js with environment variables
cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  API_URL: "${BACKEND_URL:-http://localhost:3002}",
  GAME_URL: "${GAME_URL:-http://localhost:8080}"
};
EOF

# Execute the passed command (nginx)
exec "$@"

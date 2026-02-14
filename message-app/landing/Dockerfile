FROM nginx:alpine

# Copy landing page files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets/

# Expose port 80
EXPOSE 80

# Copy entrypoint script
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Start nginx with entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

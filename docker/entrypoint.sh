#!/usr/bin/env bash
set -e

echo "=== DPRKP Docker Container Initializing ==="

# Wait for PostgreSQL database connection if DB_HOST is defined
if [ -n "$DB_HOST" ]; then
    echo "Checking database connectivity to $DB_HOST:${DB_PORT:-5432}..."
    MAX_TRIES=30
    TRIES=0
    until nc -z -w 2 "$DB_HOST" "${DB_PORT:-5432}" 2>/dev/null; do
        TRIES=$((TRIES + 1))
        if [ $TRIES -ge $MAX_TRIES ]; then
            echo "Warning: Database did not become reachable in time, proceeding anyway..."
            break
        fi
        echo "Waiting for database to accept connections ($TRIES/$MAX_TRIES)..."
        sleep 1
    done
    echo "Database check complete."
fi

# Ensure storage directory structure and permissions
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/logs \
         /var/www/html/storage/app/public \
         /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Create storage symlink if not already present
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link --force || true
fi

# Run database migrations if enabled
if [ "${AUTORUN_MIGRATIONS:-false}" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
fi

# Run database seeding if enabled
if [ "${AUTORUN_SEED:-false}" = "true" ]; then
    echo "Running database seeders..."
    php artisan db:seed --force || true
fi

# Optimize Laravel cache for production
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "Caching configuration, routes, and views for production..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
else
    echo "Clearing cache for non-production environment..."
    php artisan optimize:clear || true
fi

echo "=== DPRKP Service Ready. Starting Supervisor ==="
exec "$@"

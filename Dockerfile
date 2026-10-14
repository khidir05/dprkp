# ==============================================================================
# Stage 1: Build Frontend Assets & Wayfinder Routes (PHP 8.4 + Node 22)
# ==============================================================================
FROM php:8.4-fpm-bookworm AS frontend_builder

# Install git and unzip for Composer
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy Node.js & npm from official node:22-slim
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install composer dependencies (using PHP 8.4 so platform_check passes)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit --prefer-offline || npm install

# Copy application files needed for artisan & Wayfinder route analysis
COPY artisan ./
COPY app/ app/
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts tsconfig.json components.json eslint.config.js ./

# Compile production frontend assets into public/build (Wayfinder executes php artisan wayfinder:generate on PHP 8.4)
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime (PHP 8.4-FPM + Nginx + Supervisor)
# ==============================================================================
FROM php:8.4-fpm-bookworm

LABEL maintainer="Khidir Afwan Amlabar" \
      project="DPRKP DKI Jakarta"

ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1

# Install system dependencies & web server
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    bash \
    netcat-openbsd \
    ca-certificates \
    git \
    unzip \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required for Laravel & PostgreSQL
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    bcmath \
    gd \
    zip \
    intl \
    opcache \
    pcntl \
    exif

# Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Configure Nginx
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default /etc/nginx/conf.d/default.conf
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Configure PHP & Supervisor
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy application source code
COPY . /var/www/html

# Copy vendor dependencies from builder
COPY --from=frontend_builder /app/vendor /var/www/html/vendor

# Copy compiled frontend assets and generated routes/actions from builder
COPY --from=frontend_builder /app/public/build /var/www/html/public/build
COPY --from=frontend_builder /app/resources/js/routes /var/www/html/resources/js/routes
COPY --from=frontend_builder /app/resources/js/actions /var/www/html/resources/js/actions

# Dump optimized autoloader
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Copy and setup entrypoint script (strip carriage returns to prevent CRLF errors on Windows)
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Ensure storage & bootstrap directory permissions for www-data
RUN mkdir -p /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/framework/cache/data \
             /var/www/html/storage/logs \
             /var/www/html/storage/app/public \
             /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose HTTP port 80
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

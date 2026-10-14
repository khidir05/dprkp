# ==============================================================================
# Stage 1: Build Frontend Assets (Vite + React + Inertia + Tailwind CSS)
# ==============================================================================
FROM node:22-bookworm-slim AS node_builder

WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci --no-audit --prefer-offline || npm install

# Copy source files needed for Vite build & Wayfinder route analysis
COPY resources/ resources/
COPY routes/ routes/
COPY app/ app/
COPY public/ public/
COPY vite.config.ts tsconfig.json components.json eslint.config.js ./

# Compile production frontend assets into public/build
RUN npm run build

# ==============================================================================
# Stage 2: Install Composer Dependencies
# ==============================================================================
FROM composer:2 AS composer_builder

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# ==============================================================================
# Stage 3: Production Runtime (PHP 8.3-FPM + Nginx + Supervisor)
# ==============================================================================
FROM php:8.3-fpm-bookworm-slim

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

# Copy Composer binary from composer_builder
COPY --from=composer_builder /usr/bin/composer /usr/bin/composer

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

# Copy vendor dependencies from composer_builder
COPY --from=composer_builder /app/vendor /var/www/html/vendor

# Copy compiled frontend assets from node_builder
COPY --from=node_builder /app/public/build /var/www/html/public/build

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

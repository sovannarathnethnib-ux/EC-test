# BrandY

A compact React, TypeScript, Vite, and Tailwind storefront backed by a Laravel API and MySQL. The catalog, customer details, orders, and order items are persisted in the five-table schema in [ERD.md](./ERD.md).

## Database setup

Create a MySQL database named `brandy_store`, then copy `api/.env.example` to `api/.env` and set your database credentials. For XAMPP's default local MySQL setup, the example values work as-is.

```sh
cd api
composer install
php artisan key:generate
php artisan migrate --seed
```

The migration creates the five ERD tables. The seeder inserts Computers, Accessories, and Displays plus the Laptop ($650), Mouse ($15), Keyboard ($25), and Monitor ($120).

## Run locally

Start the API and frontend in separate terminals:

```sh
cd api
php artisan serve
```

```sh
npm install
npm run dev
```

The Vite development server proxies `/api` requests to Laravel. `npm run build` type-checks and builds the app. The API provides category and product CRUD endpoints at `/api/categories` and `/api/products`, plus order creation and lookup at `/api/orders`.

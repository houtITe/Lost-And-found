# GitHub និង Hosting Guide

## 1. Push project ទៅ GitHub

នៅ root project:

```powershell
git status
git add -A
git commit -m "feat: finish RUPP lost and found platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rupp-lost-and-found.git
git push -u origin main
```

បើ remote មានរួចហើយ ប្រើ៖

```powershell
git remote -v
git push
```

កុំ commit `backend/.env`, password, database credential ឬ API secret។

## 2. Deploy backend

Backend ត្រូវការ PHP 8.3+, Composer, database និង persistent storage។ បង្កើត Laravel service នៅ hosting provider ដែលអ្នកជ្រើស ហើយប្រើ៖

```text
Root directory: backend
Build command: composer install --no-dev --optimize-autoloader
Start command: php artisan serve --host=0.0.0.0 --port=$PORT
```

Production environment variables សំខាន់ៗ៖

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR_BACKEND_DOMAIN
FRONTEND_URL=https://YOUR_FRONTEND_DOMAIN
DB_CONNECTION=mysql
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
SANCTUM_EXPIRATION=10080
```

បន្ទាប់ពី deploy:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan optimize
```

Recycle Bin cleanup runs daily and permanently deletes resolved posts older than two days. On a
server, configure a cron entry that runs every minute:

```cron
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

For local development, use `php artisan schedule:work` in a separate terminal.

បើ hosting មាន ephemeral filesystem សូមប្រើ S3-compatible storage សម្រាប់ uploaded images។

## 3. Deploy frontend

បង្កើត static site នៅ Vercel, Netlify ឬ static hosting ផ្សេងទៀត៖

```text
Root directory: frontend
Build command: npm run build
Output directory: dist
```

ដាក់ environment variable៖

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
```

បន្ទាប់មក update backend `FRONTEND_URL` ទៅ frontend domain ពិតប្រាកដ ដើម្បីឱ្យ CORS អនុញ្ញាត request។

## 4. Final production checklist

- `APP_DEBUG=false`
- បង្កើត `APP_KEY` ថ្មីនៅ production
- ប្រើ HTTPS សម្រាប់ frontend និង backend
- Database backup និង persistent uploaded-image storage
- កុំបង្ហាញ `.env` ក្នុង GitHub
- Run `php artisan test`, `npm run lint` និង `npm run build`
- Test create report, image upload, phone/Telegram contact, comment និង claim flow

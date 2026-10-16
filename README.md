# RUPP Lost & Found

RUPP Lost & Found គឺជា platform សម្រាប់សិស្ស និងបុគ្គលិក RUPP ដើម្បីរាយការណ៍របស់ដែលបាត់ ឬរបស់ដែលបានរកឃើញ ដោយមិនបាច់បង្កើត account។

## Features

- Public lost/found board with search, type filter, category filter និង location filter
- Create report ដោយមិនបាច់ login
- Multiple image upload និង image validation
- Contact phone/Telegram នៅលើ report
- Comments សម្រាប់ជូនដំណឹងអ្នកដែលបាត់
- Private ownership claim ដែលមាន proof និង claim token
- Anonymous reporter token សម្រាប់ការគ្រប់គ្រង report នៅ backend
- Laravel database persistence ដូច្នេះ post មិនបាត់ពេល refresh
- Browser fallback នៅពេល backend មិនទាន់ដំណើរការ
- Responsive UI សម្រាប់ phone, tablet និង laptop

## Project structure

```text
lost-and-found/
├── backend/
│   ├── app/Http/Controllers/Api/   # API controllers
│   ├── app/Models/                 # Item, Comment, Claim, User
│   ├── database/migrations/        # Database structure
│   ├── routes/api.php               # Public and auth API routes
│   └── tests/Feature/               # API tests
├── frontend/
│   ├── src/services/                # API client and response normalizers
│   ├── src/App.jsx                  # Main application flow
│   ├── src/App.css                  # Main UI styles
│   └── src/support.css              # Feature and responsive styles
├── docs/DEPLOYMENT.md               # GitHub and hosting guide
└── .gitattributes
```

## Run locally

### Backend

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

កែ database values នៅ `backend/.env` ឱ្យត្រូវនឹង MySQL ឬ SQLite របស់អ្នក។

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend ប្រើ `VITE_API_URL=http://localhost:8000/api` ជា default។ Vite dev server មាន proxy សម្រាប់ `/api` រួចហើយ។

## Verify before publishing

```powershell
cd backend
php artisan test

cd ../frontend
npm run lint
npm run build
```

សូមដាក់ logo, ABA QR និង map image របស់អ្នកនៅក្នុង `frontend/public/` ប្រសិនបើចង់ប្រើ local assets។

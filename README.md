# TyphoGuard 🌊🌦️
Real-time tide, dam, and weather monitoring platform for the Philippines.  
Built with **Laravel**, **Tailwind CSS**, and public environmental APIs.

## 🚀 Features
- 📊 **Live tide levels** from free Philippine tide APIs
- 💧 **Dam water capacity monitoring**
- 🌀 **Typhoon tracking & alerts**
- 📱 Responsive UI (mobile, tablet, desktop)
- 📍 Location-specific evacuation info (future plan)

## 🛠 Tech Stack
- **Backend:** Laravel 11
- **Frontend:** Tailwind CSS + Alpine.js
- **Data Sources:** PH environmental APIs
- **Version Control:** Git + GitHub

## 📦 Installation
```bash
git clone https://github.com/YOUR_USERNAME/typhoguard.git
cd typhoguard
composer install
cp .env.example .env
php artisan key:generate
php artisan serve

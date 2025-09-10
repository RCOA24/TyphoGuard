# TyphoGuard 🌊🌦️  

**Real-time weather, tide, and dam monitoring platform for the Philippines.**  
Built with **Laravel 11**, **Tailwind CSS**, and powered by public environmental APIs including PAG-ASA, Tomorrow.io, and WeatherAPI.  

🔗 **Live Demo:** [TyphoGuard on Render](https://typhoguard.onrender.com)

---

## 🧭 Project Overview  

In the Philippines, typhoons, flooding, and extreme weather are recurring threats. **TyphoGuard** is a developer-built platform designed to provide **real-time environmental intelligence** to help communities monitor, prepare for, and respond to these events.  

Unlike generic weather apps, TyphoGuard integrates multiple layers of data:
- **Detailed weather & live radar** (up to 3 hours ahead)
- **Weather forecasts** powered by PAG-ASA, Tomorrow.io, and WeatherAPI (up to 1 week)
- **Location-based weather** using "Use my location" for real-time local forecasts
- **Dam water level monitoring** including safe, warning, and critical levels
- **Tide monitoring** across 123 stations and 23 regions in the Philippines  

This platform emphasizes **public safety, actionable insights, and local relevance**, providing users and authorities with the tools to make informed decisions before disasters strike.

---

## 🚀 Features  

### Weather & Radar
- Live radar updates for the Philippines  
- 3-hour detailed weather forecast  
- 7-day weather forecast for Manila and user’s location  
- Real-time location tracking for personalized weather updates  

### Dam Monitoring
- Real-time dam water levels from PAG-ASA  
- Safe, warning, and critical level indicators  
- Current water level comparison against safe level  
- Water level trends, dam operations, gate operations, and inflow/outflow data  

### Tide Monitoring
- Data from 123 tide stations across 23 regions  
- Region & location selection with latitude and longitude info  
- Next high tide, next low tide, and tidal range  
- Real-time location-based tide information  

### General
- Fully responsive UI (desktop, tablet, mobile)  
- Location-specific evacuation guides (planned feature)  
- Intuitive, community-focused design  

---

## 🛠 Tech Stack  
- **Backend:** Laravel 11  
- **Frontend:** Tailwind CSS + Alpine.js  
- **Data Sources:** PAG-ASA, Tomorrow.io API, WeatherAPI  
- **Version Control:** Git + GitHub  

---

## 📦 Installation  

```bash
git clone https://github.com/RCOA24/TyphoGuard.git
cd TyphoGuard
composer install
cp .env.example .env
php artisan key:generate
php artisan serve

# TyphoGuard 🌊🌦️  
Real-time tide, dam, and weather monitoring platform for the Philippines.  
Built with **Laravel**, **Tailwind CSS**, and public environmental APIs.

## 🧭 Project Overview  
In a country like the Philippines, where typhoons and flooding are a recurring threat, technology has the potential to save lives—not just streamline workflows. That belief inspired the creation of **TyphoGuard**, a developer-built platform designed to help communities monitor and prepare for extreme weather events.

This project isn’t just a showcase of technical skills—it’s a demonstration of how thoughtful design and responsive systems can serve the public good. TyphoGuard stands out through its multi-layered approach to environmental intelligence. Unlike traditional weather apps that simply display forecasts, it integrates real-time data feeds to help users monitor tide levels, dam water capacity, and typhoon trajectories—all within a clean, accessible interface.

One of the standout features is **dam control awareness**, a rarely addressed but critical component of flood prevention. By visualizing dam levels and potential overflow risks, TyphoGuard empowers both local authorities and citizens to make informed decisions before disaster strikes. This infrastructure intelligence sets the platform apart from generic weather dashboards.

The project also emphasizes **local relevance**. Emergency protocols are tailored to Philippine regions, with evacuation guides, shelter maps, and contact information designed for real-world usability. This cultural and geographic specificity transforms TyphoGuard from a generic tool into a community-first solution.

TyphoGuard is more than a portfolio piece. It’s a statement of intent: to build technology that’s not only innovative but also impactful. By combining real-time data, responsive design, and user-centered thinking, this project represents a step toward climate resilience, public safety, and tech for good—values I aim to carry forward in every role I pursue.

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
git clone https://github.com/RCOA24/TyphoGuard.git
cd typhoguard
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
# 💰 FinanceTracker Pro

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC.svg)](https://tailwindcss.com/)

> A modern, responsive finance tracking application built with React 19, Firebase, and Tailwind CSS. Manage transactions, set budgets, visualize spending patterns, and achieve financial wellness.

## ✨ Features

- **Real-time Dashboard** - Live financial insights with income, expenses, and net balance
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Smart Budgeting** - Category-based budgets with visual progress tracking
- **Interactive Charts** - Beautiful charts powered by Chart.js and Recharts
- **Secure Authentication** - Firebase-powered user authentication
- **Responsive Design** - Works perfectly on all devices
- **Real-time Updates** - Live data synchronization with Firestore

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Declarative routing for React
- **React Hook Form** - Performant forms with easy validation
- **Yup** - Schema validation for forms

### Backend & Database
- **Firebase** - Backend-as-a-Service platform
  - Firestore for real-time database
  - Authentication for user management
- **Axios** - HTTP client for API requests

### Charts & Visualization
- **Chart.js** - Simple yet flexible JavaScript charting
- **React Chart.js 2** - React wrapper for Chart.js
- **Recharts** - Composed charting library built on React components

### Development Tools
- **ESLint** - Pluggable linting utility
- **PostCSS** - Tool for transforming CSS
- **Autoprefixer** - PostCSS plugin for vendor prefixes
- **TypeScript** - Typed JavaScript for better development experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Firebase account

### Installation
```bash
git clone <repository-url>
cd finance-tracker
npm install
```

### Setup Firebase
1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication
3. Add your config to `src/lib/firebase.js`

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## 📖 Usage

1. **Register/Login** with email and password
2. **Add Transactions** - Record income and expenses
3. **Set Budgets** - Create category-based spending limits
4. **View Dashboard** - Monitor financial health in real-time
5. **Generate Reports** - Analyze spending patterns and trends

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── budget/         # Budget-related components
│   ├── common/         # Shared components (Button, Input, Modal)
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── transactions/   # Transaction components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and external services
└── utils/              # Utility functions
```

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for better financial management**

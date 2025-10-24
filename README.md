# 💰 FinanceTracker Pro

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

> Take control of your finances with this sleek, modern web application that combines powerful features with an intuitive user experience. Track expenses, manage budgets, visualize spending patterns, and achieve financial wellness—all in one beautiful interface.

## ✨ Features

### 🚀 Core Functionality
- **Real-time Dashboard**: Get instant insights into your financial health with live-updating income, expenses, and net balance
- **Transaction Management**: Add, edit, and delete income and expense transactions with ease
- **Smart Budgeting**: Set category-based budgets and track spending against limits with visual progress indicators
- **Interactive Charts**: Visualize your spending patterns with beautiful, responsive charts powered by Chart.js and Recharts
- **Comprehensive Reports**: Generate detailed financial reports to analyze trends and make informed decisions

### 🔐 Security & Authentication
- **Secure Authentication**: Firebase-powered user authentication with email/password
- **Protected Routes**: All sensitive data is secured behind authentication
- **Data Privacy**: User-specific data isolation with Firebase security rules

### 🎨 User Experience
- **Responsive Design**: Fully responsive layout that works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode Ready**: Built with Tailwind CSS for easy theme customization
- **Intuitive Navigation**: Clean sidebar navigation with organized sections
- **Loading States**: Smooth loading animations and error handling
- **Form Validation**: Robust form validation with real-time feedback

### 🛠️ Technical Excellence
- **Real-time Updates**: Live data synchronization with Firebase Firestore
- **Offline Support**: Graceful error handling and retry mechanisms
- **Performance Optimized**: Built with Vite for lightning-fast development and builds
- **TypeScript Support**: Type-safe development with TypeScript integration
- **Modern React**: Leveraging React 19 with hooks and context for state management

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/lib/firebase.js`

4. **Configure Firebase**
   Create `src/lib/firebase.js`:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### First Time Setup
1. **Register**: Create a new account with your email and password
2. **Login**: Sign in to access your personal finance dashboard

### Managing Transactions
- **Add Transaction**: Click "Add Transaction" to record income or expenses
- **Edit Transaction**: Click the edit icon on any transaction to modify details
- **Delete Transaction**: Use the delete button to remove transactions

### Setting Budgets
- **Create Budget**: Navigate to Budgets and set spending limits by category
- **Track Progress**: View budget utilization with color-coded progress bars
- **Adjust Budgets**: Modify budget amounts as needed

### Viewing Reports
- **Generate Reports**: Access the Reports page for detailed financial analysis
- **Export Data**: Download reports in various formats (PDF, Excel, Word)
- **Visual Insights**: Explore spending patterns with interactive charts

## 📁 Project Structure

```
finance-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── budget/
│   │   │   ├── BudgetForm.jsx
│   │   │   └── BudgetOverview.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── RetryError.jsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionItem.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── Charts.jsx
│   │   ├── ExpenseForm.jsx
│   │   └── ExpenseList.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── FinanceContext.jsx
│   │   └── FinanceContext.d.ts
│   ├── hooks/
│   │   ├── useApi.ts
│   │   ├── useBudget.ts
│   │   └── useExpenses.js
│   ├── lib/
│   │   └── firebase.js
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Reports.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── api.ts
│   │   ├── auth.js
│   │   ├── notifications.ts
│   │   └── reports.ts
│   ├── utils/
│   │   ├── budgetAnalysis.ts
│   │   ├── budgetTemplates.ts
│   │   ├── constants.js
│   │   ├── errorHandling.ts
│   │   ├── financialHealthCalculator.ts
│   │   └── helpers.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🎯 Key Components

### Context Providers
- **AuthContext**: Manages user authentication state
- **FinanceContext**: Handles all financial data operations with real-time updates

### Custom Hooks
- **useApi**: Centralized API communication
- **useBudget**: Budget-specific logic and calculations
- **useExpenses**: Expense management utilities

### Utility Functions
- **budgetAnalysis**: Advanced budget tracking and analysis
- **financialHealthCalculator**: Financial wellness scoring
- **errorHandling**: Comprehensive error management

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service platform
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling

---

**Made with ❤️ for financial freedom and better money management.**

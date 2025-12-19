# 💰 FinanceTracker Pro

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-1.0.0-blue.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC.svg)](https://tailwindcss.com/)

> A modern, responsive finance tracking application built with React 19, Supabase, and Tailwind CSS. Manage transactions, set budgets, visualize spending patterns, and achieve financial wellness.

## ✨ Features

- **Real-time Dashboard** - Live financial insights with income, expenses, and net balance
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Smart Budgeting** - Category-based budgets with visual progress tracking
- **Interactive Charts** - Beautiful charts powered by Chart.js and Recharts
- **Secure Authentication** - Supabase-powered user authentication
- **Responsive Design** - Works perfectly on all devices
- **Real-time Updates** - Live data synchronization with Supabase

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with concurrent features
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Declarative routing for React
- **React Hook Form** - Performant forms with easy validation
- **Yup** - Schema validation for forms

### Backend & Database

- **Supabase** - Postgres + Realtime + Auth (recommended tables: `transactions`, `budgets`, `expenses`)
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
- Supabase account
- Create `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Installation

```bash
git clone <repository-url>
cd finance-tracker
npm install
```

### Setup Supabase

1. Create a Supabase project at https://app.supabase.com/
2. Create the tables `transactions`, `budgets`, `expenses` (fields: `id`, `uid`, `amount`, `date`/`created_at`, `updated_at`, etc). Use SQL or Table Editor.
3. In your project root create a `.env.local` file and add (example provided in `.env.example`):

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

> **Important:** Do **not** commit `.env.local`. Add your Supabase **service_role** key only to a server-side environment (e.g., your backend or server functions) — never expose it to client-side code.

4. Use `src/lib/supabaseClient.js` to initialize Supabase client (already included in project). The client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from environment variables.

5. Create tables and policies: run the SQL in `supabase/schema.sql` in your Supabase project's SQL editor to create the `transactions`, `budgets`, and `expenses` tables and RLS policies.

6. Start the dev server and test flows locally (registration, login, add/edit/delete transactions and budgets).

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

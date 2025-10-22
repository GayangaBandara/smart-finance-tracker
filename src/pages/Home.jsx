import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, Users } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Track Expenses',
      description: 'Monitor your spending patterns and categorize transactions effortlessly.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Get insights with interactive charts and detailed financial reports.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security.',
    },
    {
      icon: Users,
      title: 'Budget Planning',
      description: 'Set budgets, track progress, and achieve your financial goals.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="text-indigo-600"> Finances</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track expenses, manage budgets, and gain insights into your spending habits
              with our comprehensive finance tracking solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your money
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to help you make better financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start tracking your finances?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who are already managing their money better.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
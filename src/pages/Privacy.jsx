import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Footer from '../components/layout/Footer';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: December 19, 2025</p>
            </div>

            <div className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-3">
                  We collect information you provide directly to us, such as when you create an
                  account, use our services, or contact us for support:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Email address and authentication information</li>
                  <li>Financial data you input (transactions, budgets, categories)</li>
                  <li>Usage data and preferences</li>
                  <li>Device and browser information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Ensure the security of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  3. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 mb-3">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist in our operations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction. However, no
                  method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  5. Data Storage and Processing
                </h2>
                <p className="text-gray-700">
                  Your financial data is stored securely using Supabase (PostgreSQL database with
                  built-in security features). Data is encrypted in transit and at rest. We process
                  data in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. User Rights</h2>
                <p className="text-gray-700 mb-3">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Cookies and Tracking
                </h2>
                <p className="text-gray-700">
                  We may use cookies and similar tracking technologies to collect and use personal
                  information about you. You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our service is not intended for children under 13. We do not knowingly collect
                  personal information from children under 13. If we become aware that we have
                  collected such information, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new policy on this page and updating the "Last updated"
                  date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us through the
                  support channels provided in the application.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <Link to="/register">
                <Button>Back to Registration</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;

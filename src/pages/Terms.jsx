import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Footer from '../components/layout/Footer';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="flex-1 bg-gray-50 w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">Last updated: December 19, 2025</p>
            </div>

            <div className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing and using Finance Tracker, you accept and agree to be bound by the
                  terms and provision of this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use License</h2>
                <p className="text-gray-700 mb-3">
                  Permission is granted to temporarily use Finance Tracker for personal,
                  non-commercial transitory viewing only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Account</h2>
                <p className="text-gray-700">
                  You are responsible for safeguarding the password and for all activities that
                  occur under your account. You agree not to disclose your password to any third
                  party and to take sole responsibility for activities that occur under your
                  account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Financial Data</h2>
                <p className="text-gray-700">
                  Finance Tracker is a personal finance management tool. We do not provide financial
                  advice. All financial decisions should be made based on your own research and
                  consideration. The accuracy of financial data entered into the system is your
                  responsibility.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Privacy</h2>
                <p className="text-gray-700">
                  Your privacy is important to us. Please review our Privacy Policy, which also
                  governs your use of the service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal and financial
                  information. However, no method of transmission over the internet is 100% secure,
                  and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  7. Service Availability
                </h2>
                <p className="text-gray-700">
                  We strive to maintain service availability but cannot guarantee uninterrupted
                  access. The service may be temporarily unavailable due to maintenance, updates, or
                  technical issues.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Termination</h2>
                <p className="text-gray-700">
                  We may terminate or suspend your account and access to the service immediately,
                  without prior notice or liability, for any reason whatsoever, including without
                  limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  9. Limitation of Liability
                </h2>
                <p className="text-gray-700">
                  In no event shall Finance Tracker be liable for any damages arising out of the use
                  or inability to use the materials on the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  10. Contact Information
                </h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us through
                  the support channels provided in the application.
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

export default Terms;

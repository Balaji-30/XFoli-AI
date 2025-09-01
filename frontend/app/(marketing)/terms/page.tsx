export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Last updated: January 2024
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Important Notice
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                By using XFoli AI, you agree to these Terms of Service. Please read them carefully. 
                This service is provided for informational purposes only and does not constitute financial advice.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing or using XFoli AI (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). 
              If you do not agree with any part of these terms, you may not access the Service. These Terms apply to all 
              visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              XFoli AI is a portfolio tracking application that provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Real-time stock market data and portfolio valuation</li>
              <li>AI-powered analysis and insights</li>
              <li>Portfolio organization and tracking tools</li>
              <li>Educational content about investment performance</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The Service is provided for informational and educational purposes only and does not constitute 
              financial, investment, or trading advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts and Registration
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Financial Information Disclaimer
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Important:</strong> XFoli AI provides information for educational purposes only. 
                The Service does not provide investment advice, financial planning, or recommendations for buying or selling securities.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>All investment decisions are your sole responsibility</li>
                <li>Past performance does not guarantee future results</li>
                <li>Market data may be delayed or inaccurate</li>
                <li>AI analysis may contain errors or inaccuracies</li>
                <li>Always consult qualified financial advisors before making investment decisions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Data and Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Your privacy is important to us. Our collection and use of your information is governed by our Privacy Policy. 
              By using the Service, you consent to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Collection of portfolio data you manually enter</li>
              <li>Use of cookies and similar technologies</li>
              <li>Processing of data to provide Service features</li>
              <li>Storage of your data on secure servers</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              We do not sell, share, or distribute your personal information to third parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Service may integrate with third-party services for market data, authentication, and other features. 
              These third-party services have their own terms of service and privacy policies. We are not responsible 
              for the content, accuracy, or availability of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by XFoli AI and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property laws. 
              You may not reproduce, distribute, modify, or create derivative works of our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>IMPORTANT LIABILITY LIMITATION:</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To the fullest extent permitted by law, XFoli AI shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Financial losses from investment decisions</li>
                <li>Lost profits or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Service interruptions or downtime</li>
                <li>Inaccurate market data or AI analysis</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Service Availability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We strive to provide reliable service but do not guarantee uninterrupted access. The Service may 
              experience downtime for maintenance, updates, or technical issues. We reserve the right to modify, 
              suspend, or discontinue the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You may terminate your account at any time by contacting us or using the account deletion feature. 
              We may terminate or suspend your account immediately if you violate these Terms. Upon termination, 
              your right to use the Service ceases, and we may delete your account data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes 
              by posting the new Terms on this page and updating the &ldquo;Last updated&rdquo; date. Your continued use of 
              the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the United States. 
              Any disputes arising from these Terms or the Service will be resolved through binding arbitration 
              or in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about these Terms of Service, please contact us through the support channels 
              provided in the application. We will respond to inquiries within a reasonable time frame.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              15. Severability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions 
              will continue in full force and effect. The invalid provision will be replaced with a valid provision 
              that most closely matches the intent of the original provision.
            </p>
          </section>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Questions about these Terms?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We&apos;re here to help clarify any questions you may have about our Terms of Service.
            </p>
            <a 
              href="/faq" 
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Visit FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 
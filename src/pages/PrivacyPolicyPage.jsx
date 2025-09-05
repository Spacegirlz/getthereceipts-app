import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Get The Receipts</title>
        <meta name="description" content="Read our Privacy Policy to understand how Get The Receipts collects, uses, and protects your personal information." />
        <meta property="og:title" content="Privacy Policy - Get The Receipts" />
        <meta property="og:description" content="Read our Privacy Policy to understand how Get The Receipts collects, uses, and protects your personal information." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 text-white max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last Updated: August 25, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">Our Privacy-First Commitment</h2>
          <p className="mb-3 text-lg text-gray-300">
            Your privacy is not an afterthought; it's our foundation. We've designed Get The Receipts to give you maximum insight with minimum data exposure. You are in control.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
          <p className="mb-3">We collect the absolute minimum information needed to provide our service.</p>
          <h3 className="text-xl font-semibold mb-2">Account Information:</h3>
          <ul className="list-disc pl-5 mb-3 text-gray-300">
            <li>Email address (for account creation, authentication, and communication).</li>
            <li>Payment information (processed securely by Stripe; we never see or store your full card details).</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Usage Data:</h3>
          <ul className="list-disc pl-5 mb-3 text-gray-300">
            <li>
              <strong>Receipt History (Optional):</strong> If you choose to enable it in your <Link to="/settings" className="text-purple-400 underline">Settings</Link>, we will store your analysis results (the "receipts") so you can view them on your dashboard. This includes the original message, quiz answers, and the analysis. You can disable this at any time, and any new analyses will not be stored.
            </li>
            <li>
              <strong>Anonymous Usage:</strong> For non-logged-in users, we track usage via IP address solely to enforce our daily free limit. This data is not linked to any personal account and is automatically cycled.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
          <p className="mb-3">We use your information for the following purposes:</p>
          <ul className="list-disc pl-5 mb-3 text-gray-300">
            <li>To create and manage your account.</li>
            <li>To provide real-time analysis of the text messages you submit.</li>
            <li>To optionally save your receipt history to your dashboard, if you have enabled this feature.</li>
            <li>To process payments for premium services.</li>
            <li>To manage our referral program.</li>
            <li>To prevent fraud and secure our services.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">3. Your Control and Rights (The Important Part)</h2>
          <p className="mb-3">We put you in the driver's seat of your data.</p>
          <ul className="list-disc pl-5 mb-3 text-gray-300">
            <li>
              <strong>Control Your History:</strong> You can enable or disable the saving of your receipt history at any time in your <Link to="/settings" className="text-purple-400 underline">Account Settings</Link>. If disabled, we perform the analysis in real-time and immediately discard the message and results.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can permanently delete your entire receipt history at any time from your <Link to="/settings" className="text-purple-400 underline">Account Settings</Link>.
            </li>
            <li>
              <strong>Access and Rectification:</strong> You can access your account information and saved receipts through your dashboard.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">4. Third-Party Services</h2>
          <p className="mb-3">We use trusted third-party services to operate:</p>
          <ul className="list-disc pl-5 mb-3 text-gray-300">
            <li><strong>Supabase:</strong> For secure database hosting and authentication.</li>
            <li><strong>Stripe:</strong> For secure payment processing.</li>
            <li><strong>AI Models:</strong> Our AI providers process text for analysis but are contractually and technically prevented from retaining the data long-term or using it for training.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">5. Security</h2>
          <p className="mb-3">
            We implement industry-standard security measures, including encryption and secure protocols, to protect your data. However, no system is 100% impenetrable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">6. Contact Us</h2>
          <p className="mb-3">If you have any questions about our privacy-first approach, please contact us:</p>
          <p className="font-semibold">Email: <a href="mailto:support@getthereceipts.com" className="text-purple-400 hover:text-purple-300 transition-colors">support@getthereceipts.com</a></p>
        </section>

        <div className="mt-12 text-center">
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
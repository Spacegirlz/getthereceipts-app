import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy  -  Get The Receipts</title>
        <meta name="description" content="Read our Privacy Policy to understand how Get The Receipts collects, uses, and protects your personal information." />
        <meta property="og:title" content="Privacy Policy  -  Get The Receipts" />
        <meta property="og:description" content="Read our Privacy Policy to understand how Get The Receipts collects, uses, and protects your personal information." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 text-white max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
            <span className="text-blue-400">🔒</span>
            <span className="text-blue-400 text-sm font-medium">Privacy First Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Privacy Policy</h1>
          <p className="text-xl text-gray-300 mb-4">Last Updated: September 21, 2025</p>
        </div>

        {/* Our Privacy First Philosophy */}
        <section className="mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Our Privacy First Philosophy</h2>
          <p className="text-lg text-gray-300 mb-4">
            At Get The Receipts, privacy isn't just a feature-it's our foundation. We believe your personal communications should remain exactly that: personal. This Privacy Policy explains our commitment to protecting your privacy and details how we've built our entire service around the principle that your messages are analyzed and immediately forgotten.
          </p>
          <p className="text-lg text-gray-300">
            We designed our architecture from the ground up to ensure that your most sensitive information-your personal communications-never becomes a permanent part of our systems. This isn't just good practice; it's who we are.
          </p>
        </section>

        {/* We Store Nothing Banner */}
        <div className="mb-12 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 text-white">🚫 We Store Nothing. Period.</h2>
            <p className="text-xl text-gray-300 mb-4">
              No receipts. No messages. No history. No tracking.<br/>
              Everything is processed in real-time and immediately discarded.
            </p>
            <p className="text-lg text-gray-400">
              Our zero-storage architecture means that your receipts and messages exist in our system only for the milliseconds needed to analyze them. Once the analysis is complete and delivered to you, everything is permanently deleted from our servers.
            </p>
          </div>
        </div>

        {/* What We Don't Collect */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">🚫</span>
            What We Don't Collect (Almost Everything)
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We've built Get The Receipts to be radically private. Here's what we don't collect or store:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No receipt storage  -  analyzed and immediately deleted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No message history  -  processed and instantly discarded</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No analysis results saved  -  shown once and gone forever</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No behavioral tracking or usage analytics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No tracking cookies (only essential authentication cookies)</span>
            </li>
          </ul>
        </section>

        {/* What We Do Collect */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">📋</span>
            What We Do Collect: The Absolute Minimum
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We collect only what's essential to make your account work:
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600 rounded-lg">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="border border-gray-600 px-4 py-3 text-left text-white font-semibold">What We Keep</th>
                  <th className="border border-gray-600 px-4 py-3 text-left text-white font-semibold">Why We Need It</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">Email address</td>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">For account login and important service communications</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">Encrypted password</td>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">To secure your account access</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">Payment information</td>
                  <td className="border border-gray-600 px-4 py-3 text-gray-300">Processed securely through Stripe (we never see your card details)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300 mb-3">What We Never Keep:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Your actual receipts or messages</li>
              <li>• Message contents or analysis history</li>
              <li>• Personal information beyond what's listed above</li>
            </ul>
          </div>
        </section>

        {/* How Our Real-Time Processing Works */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">⚡</span>
            How Our Real-Time Processing Works
          </h2>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">The 3-Second Rule:</h3>
            <p className="text-lg text-gray-300">
              Your data exists in our system for approximately 3 seconds-just long enough to analyze and return results.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <p className="text-gray-300">You submit a receipt or message through our secure interface</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <p className="text-gray-300">Our AI analyzes it instantly (1-3 seconds)</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <p className="text-gray-300">Results are sent to your screen</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                4
              </div>
              <p className="text-gray-300">Everything is permanently deleted from our servers</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300">
              <strong className="text-white">Technical Implementation:</strong> We use stateless processing with no persistent storage. Data exists only in temporary memory during processing and is immediately garbage-collected afterward.
            </p>
          </div>
        </section>

        {/* AI Training Guarantee */}
        <section className="mb-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">🛡️</span>
            AI Training Guarantee: Your Data Stays Yours
          </h2>
          <h3 className="text-xl font-semibold text-green-300 mb-4">Your Data Is Never Used for AI Training</h3>
          <p className="text-lg text-gray-300 mb-6">
            We have binding contractual agreements with our AI providers that explicitly prohibit the use of your data for model training or improvement. This means:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No data retention by AI services</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>API calls configured for zero-logging</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Contractually guaranteed data isolation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Regular audits to ensure compliance</span>
            </li>
          </ul>
        </section>

        {/* About Sage */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">🔮</span>
            About Sage: Our AI Assistant
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Sage is our fictional AI character who provides pattern-based insights about communication styles and relationship dynamics. Here's what's important to understand:
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-300 mb-4">
              <strong className="text-yellow-300">Sage's insights are for entertainment and reflection only.</strong> They are not predictions, medical advice, or professional guidance. Sage:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Provides emotional pattern recognition based on text analysis</li>
              <li>• Offers perspective and observations, not certainty</li>
              <li>• Cannot read minds or predict the future</li>
              <li>• Should be considered one perspective among many in your decision-making</li>
            </ul>
          </div>
        </section>

        {/* Your Rights and Control */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">👤</span>
            Your Rights and Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-300 mb-4">You Can Always:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Delete your account instantly through your account settings</li>
                <li>• Export your minimal account data</li>
                <li>• Opt out of any communications</li>
                <li>• Contact us with privacy questions or concerns</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-300 mb-4">We Will Never:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Sell your information to third parties</li>
                <li>• Share your data without your explicit consent</li>
                <li>• Store receipts or messages after processing</li>
                <li>• Track your behavior across other websites</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">🔗</span>
            Third-Party Services: Minimal and Privacy-Focused
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We use only essential third-party services, all chosen for their strong privacy standards:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Supabase:</strong> Secure authentication and database hosting (stores only account information, never receipts)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Stripe:</strong> Payment processing (we never see your payment details)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Rewardful:</strong> Affiliate program management for our Receipts and Riches Affiliate Program. Tracks referral links, commission data, and affiliate performance metrics. Rewardful's privacy policy governs their data handling practices, and they do not access your personal messages or receipt content.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">AI Services:</strong> Real-time analysis with contractual no-training guarantees</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Vercel:</strong> Secure website hosting and deployment</span>
            </li>
          </ul>
        </section>

        {/* Affiliate Program Data Handling */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">🤝</span>
            Affiliate Program Data Handling
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            For our Receipts and Riches Affiliate Program, we work with Rewardful to manage affiliate relationships and track referrals. Here's how this affects your privacy:
          </p>
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">What Rewardful Tracks:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Referral links and click tracking</li>
                <li>• Commission calculations and payouts</li>
                <li>• Affiliate performance metrics</li>
                <li>• Basic account information for affiliate management</li>
              </ul>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2">What Rewardful Does NOT Access:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Your personal messages or receipt content</li>
                <li>• AI analysis results or insights</li>
                <li>• Your communication history</li>
                <li>• Any sensitive personal data beyond affiliate management</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300">
                <strong className="text-white">Important:</strong> Rewardful operates under their own privacy policy and data handling practices. We ensure they only receive the minimal data necessary for affiliate program management. Your core service usage (messages, receipts, AI analysis) remains completely separate from affiliate tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">🔐</span>
            Security Measures
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We implement comprehensive security measures to protect the minimal data we do store:
          </p>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>End-to-end encryption for all data transmission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Industry-standard password hashing and storage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Regular security audits and system updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Secure HTTPS connections for all communications</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Most importantly: No sensitive data to breach, since we don't store it</span>
            </li>
          </ul>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <p className="text-gray-300">
              While we implement robust security measures, no system is 100% impenetrable. Our most effective security feature is our architectural decision not to store your sensitive communications at all.
            </p>
          </div>
        </section>

        {/* Age Requirement and Safety */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">👶</span>
            Age Requirement and Safety
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            This Service is intended for users who are at least 16 years old. We have implemented comprehensive safety measures throughout our platform, including content filtering and prominent safety notices on every page.
          </p>
          <p className="text-lg text-gray-300">
            Users aged 16-17 may use the Service, though we encourage parental guidance given the personal nature of relationship analysis. We do not knowingly collect personal information from anyone under 16.
          </p>
        </section>

        {/* Data Protection Rights */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">⚖️</span>
            Your Data Protection Rights
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Depending on your location, you may have specific rights regarding your personal data:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Right to Access:</strong> Request copies of the personal data we hold about you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Right to Rectification:</strong> Request correction of any inaccurate information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span><strong className="text-white">Right to Data Portability:</strong> Request transfer of your data to another service</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-gray-300">
              To exercise these rights, contact us at <a href="mailto:support@getthereceipts.com" className="text-blue-400 hover:text-blue-300">support@getthereceipts.com</a>.
            </p>
          </div>
        </section>

        {/* International Data Transfers */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">🌍</span>
            International Data Transfers
          </h2>
          <p className="text-lg text-gray-300">
            Your minimal account information may be transferred to and maintained on computers located outside your jurisdiction. We use Standard Contractual Clauses and other approved legal mechanisms to ensure your data receives equivalent protection regardless of location.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">📝</span>
            Changes to This Privacy Policy
          </h2>
          <p className="text-lg text-gray-300">
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. If we make material changes, we will notify you by email and post a prominent notice on our website before the changes take effect.
          </p>
        </section>

        {/* Mental Health and Safety Resources */}
        <section className="mb-12 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">🆘</span>
            Mental Health and Safety Resources
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This service is for entertainment and personal insight only. If you're experiencing emotional distress or crisis, please reach out for professional help:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">US Resources:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• National Suicide Prevention Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">International:</h3>
              <p className="text-gray-300">
                Visit <a href="https://findahelpline.com" className="text-blue-400 hover:text-blue-300 underline">findahelpline.com</a> for resources in your country
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">⚖️</span>
            Governing Law
          </h2>
          <p className="text-lg text-gray-300">
            This Privacy Policy is governed by the laws of Australia, including the Australian Privacy Act 1988 and Australian Privacy Principles (APPs).
          </p>
        </section>

        {/* Contact CTA Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 text-white flex items-center justify-center gap-3">
              Questions About Privacy?
            </h2>
            <p className="text-xl text-gray-300 mb-6">We're committed to transparency and are happy to answer any questions.</p>
            <a 
              href="mailto:support@getthereceipts.com" 
              className="inline-block text-blue-400 text-xl font-semibold bg-blue-500/10 border border-blue-500 px-8 py-3 rounded-full hover:bg-blue-500/20 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              support@getthereceipts.com
            </a>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-12 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Company Information</h3>
          <div className="text-center space-y-2">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Company:</span> Get The Receipts
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Address:</span> 36/150 Albert Rd, South Melbourne VIC 3205, Australia
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-white">Contact:</span> support@getthereceipts.com
            </p>
          </div>
        </div>

        {/* Legal Shield Footer Note */}
        <div className="mt-12 mb-8 text-center p-4 bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-600/30">
          <p className="text-gray-300 text-sm">
            <strong className="text-white">Note:</strong> All readings are for entertainment and insight purposes only. 
            Sage is a fictional emotional analyst and does not offer therapeutic or legal advice.
          </p>
        </div>


        {/* Simple Clean Footer */}
        <footer className="px-6 py-8 bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
              <Link to="/refer" className="text-gray-400 hover:text-white transition-colors text-sm">Earn & Refer</Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
            
            {/* Disclaimer */}
            <p className="text-gray-500 text-xs mb-2">For 16+ Entertainment Purposes Only</p>
            
            {/* Copyright */}
            <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
            
            {/* Support */}
            <p className="text-gray-500 text-xs">
              Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default PrivacyPolicyPage;
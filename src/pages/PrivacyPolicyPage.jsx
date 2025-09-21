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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
            <span className="text-blue-400">🔒</span>
            <span className="text-blue-400 text-sm font-medium">Privacy First Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Privacy Policy</h1>
          <p className="text-xl text-gray-300 mb-4">Your messages are analyzed and immediately forgotten</p>
          <p className="text-gray-400 text-sm">Last Updated: September 14, 2025 | Effective Immediately</p>
        </div>

        {/* Zero Storage Banner */}
        <div className="mb-12 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-2 border-green-500/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 text-white">🚫 We Store Nothing. Period.</h2>
            <p className="text-xl text-gray-300">
              No receipts. No messages. No history. No tracking.<br/>
              Everything is processed in real-time and immediately discarded.
            </p>
          </div>
        </div>

        {/* Section 1: What We DON'T Collect */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">🚫</span>
            What We DON'T Collect (Almost Everything)
          </h2>
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-lg mb-4">
            <p className="font-semibold text-green-300 mb-2">Zero-Storage Architecture:</p>
            <p className="text-gray-300">We've built Get The Receipts to be radically private. Your receipts and messages exist only for the milliseconds needed to analyze them.</p>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No receipt storage - analyzed and immediately deleted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No message history - processed and instantly discarded</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No analysis results saved - shown once and gone forever</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No behavioral tracking or usage analytics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No cookies for tracking (only essential authentication)</span>
            </li>
          </ul>
        </section>

        {/* Section 2: Minimal Account Data */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">👤</span>
            Minimal Account Information
          </h2>
          <p className="mb-6 text-gray-300">We only store the absolute minimum to make your account work:</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-blue-400 font-semibold mb-3">What We Keep:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Email address (for login)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Encrypted password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Payment info (via Stripe, if premium)</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-red-400 font-semibold mb-3">What We Never Keep:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Your actual receipts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Message contents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Analysis history</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Real-Time Processing */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">⚡</span>
            How Real-Time Processing Works
          </h2>
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-blue-300 mb-2">The 3-Second Rule:</p>
            <p className="text-gray-300">Your data exists in our system for approximately 3 seconds - just long enough to analyze and return results.</p>
          </div>
          <ol className="space-y-4 text-gray-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
              <span>You submit a receipt/message</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
              <span>Our AI analyzes it instantly (1-3 seconds)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</span>
              <span>Results are sent to your screen</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</span>
              <span>Everything is permanently deleted from our servers</span>
            </li>
          </ol>
          <p className="text-gray-400 text-sm">
            <strong>Technical Implementation:</strong> We use stateless processing with no persistent storage. Data exists only in temporary memory during processing and is garbage-collected immediately after.
          </p>
        </section>

        {/* Section 4: AI Training Guarantee */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl">🤖</span>
            AI Training Guarantee
          </h2>
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-green-300 mb-2">Your Data Is Never Used for AI Training</p>
            <p className="text-gray-300">We have contractual agreements with our AI providers explicitly prohibiting the use of your data for model training or improvement.</p>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No data retention by AI services</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>API calls are configured for zero-logging</span>
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

        {/* Section 5: About Sage */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">🔮</span>
            About Sage (Our AI Assistant)
          </h2>
          <p className="mb-6 text-gray-300">Sage is a fictional character providing pattern-based insights. Here's what you need to know:</p>
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-yellow-300 mb-2">Important:</p>
            <p className="text-gray-300">Sage's insights are for entertainment and reflection only. They are NOT predictions, medical advice, or professional guidance.</p>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Provides emotional pattern recognition</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Offers perspective, not certainty</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Cannot read minds or predict futures</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Should be one perspective among many</span>
            </li>
          </ul>
        </section>

        {/* Section 6: Your Rights & Control */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-xl">⚖️</span>
            Your Rights & Control
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-emerald-400 font-semibold mb-3">You Can Always:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Delete your account instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Export your account data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Opt out of any communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>Request data deletion</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-red-400 font-semibold mb-3">We Will Never:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Sell your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Share data without consent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Store receipts after processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span>Track your behavior</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7: Third-Party Services */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-xl">🔗</span>
            Third-Party Services
          </h2>
          <p className="mb-6 text-gray-300">We use minimal third-party services, all chosen for their privacy standards:</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-cyan-400 font-semibold mb-3">Supabase</h3>
              <p className="text-gray-300 text-sm">Secure authentication and database (stores only account info, never receipts)</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-cyan-400 font-semibold mb-3">Stripe</h3>
              <p className="text-gray-300 text-sm">Payment processing (we never see your card details)</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-cyan-400 font-semibold mb-3">AI Services</h3>
              <p className="text-gray-300 text-sm">Real-time analysis with contractual no-training guarantees</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-cyan-400 font-semibold mb-3">Vercel</h3>
              <p className="text-gray-300 text-sm">Secure hosting and deployment</p>
            </div>
          </div>
        </section>

        {/* Section 8: Security Measures */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">🔐</span>
            Security Measures
          </h2>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>End-to-end encryption for all data transmission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Industry-standard password hashing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>Secure HTTPS connections only</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>No data to breach (since we don't store it)</span>
            </li>
          </ul>
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="font-semibold text-blue-300 mb-2">Note:</p>
            <p className="text-gray-300">While we implement strong security, no system is 100% impenetrable. Our best security feature is that we don't store your sensitive data at all.</p>
          </div>
        </section>

        {/* Section 9: Legal Disclaimers & Limitations */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">⚠️</span>
            Legal Disclaimers & Limitations
          </h2>
          <div className="space-y-6">
            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-lg">
              <p className="font-semibold text-amber-300 mb-2">USE AT YOUR OWN RISK</p>
              <p className="text-gray-300 text-sm">
                This service is for entertainment and personal insight only. You acknowledge that you use this service entirely at your own risk and are solely responsible for any decisions or actions taken based on the analyses provided.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-red-400 font-semibold">Critical Limitations:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">⚠️</span>
                  <span>NOT a substitute for professional advice (legal, medical, financial, tax, or psychological)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">⚠️</span>
                  <span>Analysis results should NOT be used as evidence for any official purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">⚠️</span>
                  <span>We do NOT verify the authenticity of submitted receipts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">⚠️</span>
                  <span>We make NO guarantees about accuracy, completeness, or reliability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">⚠️</span>
                  <span>AI systems may produce inaccurate or inappropriate responses</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-red-400 font-semibold mb-3">Liability Waiver:</h3>
              <p className="text-gray-300 text-sm">To the maximum extent permitted by law, Get The Receipts and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our service.</p>
            </div>

            <div>
              <h3 className="text-red-400 font-semibold mb-3">Indemnification:</h3>
              <p className="text-gray-300 text-sm">You agree to indemnify, defend, and hold harmless Get The Receipts, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service or violation of these terms.</p>
            </div>
          </div>
        </section>

        {/* Section 10: Additional Legal Terms */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-500 rounded-xl flex items-center justify-center text-xl">📋</span>
            Additional Legal Terms
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Age Requirement:</h3>
              <p className="text-gray-300">You must be at least 16 years old to use this service.</p>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Children's Privacy:</h3>
              <p className="text-gray-300">Users under 16 are not permitted to use the Service. We do not knowingly collect personal information from children under 16. If we discover we've inadvertently collected such information, we will delete it immediately.</p>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Governing Law:</h3>
              <p className="text-gray-300">This policy is governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction.</p>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Policy Updates:</h3>
              <p className="text-gray-300">We may update this policy at any time. Continued use of the service constitutes acceptance of any changes.</p>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Severability:</h3>
              <p className="text-gray-300">If any provision of this policy is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
            </div>
          </div>
        </section>

        {/* Section 11: Mental Health Resources */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl">💚</span>
            Mental Health Resources
          </h2>
          <p className="mb-6 text-gray-300">If you're experiencing emotional distress or crisis, please reach out for professional help:</p>
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="font-semibold text-blue-300 mb-2">US Resources:</p>
            <p className="text-gray-300 mb-2">
              • National Suicide Prevention Lifeline: 988<br/>
              • Crisis Text Line: Text HOME to 741741
            </p>
            <p className="font-semibold text-blue-300 mb-2">International:</p>
            <p className="text-gray-300">
              • Visit <a href="https://findahelpline.com" className="text-blue-400 hover:text-blue-300 underline">findahelpline.com</a> for resources in your country
            </p>
          </div>
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

        {/* Navigation Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 mb-8">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
        </div>

        {/* Footer */}
        <footer className="relative px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🔮</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                    Get The Receipts
                  </span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Stop second-guessing their texts. Get clarity in 60 seconds with Sage, your AI bestie with opinions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <div className="space-y-2">
                  <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                  <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
                  <Link to="/refer" className="block text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link to="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link to="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-gray-400 text-sm mb-3">
                © 2025 Get The Receipts. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mb-3">
                16+ only • For Entertainment Purposes Only • Not therapy, legal, or medical advice • Sage is an AI character with opinions, not facts
              </p>
              <p className="text-gray-600 text-sm">
                Support: <a href="mailto:support@getthereceipts.com" className="text-violet-400 hover:text-violet-300 transition-colors">support@getthereceipts.com</a>
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default PrivacyPolicyPage;
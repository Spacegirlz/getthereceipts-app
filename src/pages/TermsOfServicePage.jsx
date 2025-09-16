import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Get The Receipts</title>
        <meta name="description" content="Read the Terms of Service for Get The Receipts. These terms govern your use of our website and services." />
        <meta property="og:title" content="Terms of Service - Get The Receipts" />
        <meta property="og:description" content="Read the Terms of Service for Get The Receipts. These terms govern your use of our website and services." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 text-white max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full mb-4">
            <span className="text-red-400">⚖️</span>
            <span className="text-red-400 text-sm font-medium">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Terms of Service</h1>
          <p className="text-xl text-gray-300 mb-4">Please read carefully before using Get The Receipts</p>
          <p className="text-gray-400 text-sm">Last Updated: September 14, 2025 | Effective Immediately</p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-blue-400 font-semibold mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#acceptance" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">1. Acceptance of Terms</a>
            <a href="#eligibility" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">2. Eligibility & Account</a>
            <a href="#service" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">3. Service Description</a>
            <a href="#prohibited" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">4. Prohibited Uses</a>
            <a href="#content" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">5. User Content & Rights</a>
            <a href="#disclaimers" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">6. Disclaimers & Limitations</a>
            <a href="#indemnification" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">7. Indemnification</a>
            <a href="#termination" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">8. Termination</a>
            <a href="#disputes" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">9. Dispute Resolution</a>
            <a href="#general" className="text-gray-300 hover:text-blue-400 transition-colors block py-1">10. General Provisions</a>
          </div>
        </div>

        {/* Section 1: Acceptance */}
        <section id="acceptance" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">📜</span>
            1. Acceptance of Terms
          </h2>
          <p className="mb-6 text-gray-300">These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," "your") and Get The Receipts ("we," "us," "our") governing your access to and use of getthereceipts.com and all related services (collectively, "the Service").</p>
          
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-yellow-300 mb-2">By accessing or using the Service, you agree to be bound by these Terms.</p>
            <p className="text-gray-300 text-sm">If you do not agree to all provisions, you must immediately discontinue use of the Service.</p>
          </div>
          
          <p className="text-gray-300">These Terms incorporate by reference our Privacy Policy and any other policies posted on our Service.</p>
        </section>

        {/* Section 2: Eligibility */}
        <section id="eligibility" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl">👤</span>
            2. Eligibility & Account Requirements
          </h2>
          
          <div className="mb-6">
            <h3 className="text-red-400 font-semibold mb-3">Age Requirement:</h3>
            <div className="bg-red-500/10 border-2 border-red-500 p-4 rounded-lg text-center mb-6">
              <p className="font-bold text-red-300 text-lg">YOU MUST BE AT LEAST 13 YEARS OLD TO USE THIS SERVICE</p>
              <p className="text-gray-300 text-sm mt-2">Users aged 13-17 require parental consent</p>
            </div>
          </div>
          
          <p className="mb-4 text-gray-300">By using the Service, you represent and warrant that:</p>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>You are at least 13 years of age (with parental consent if under 18)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>You have the legal capacity to enter into binding agreements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>You are not prohibited from using the Service under applicable laws</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>You will provide accurate and complete registration information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-1">✓</span>
              <span>You will maintain the security of your account credentials</span>
            </li>
          </ul>
          
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="font-semibold text-blue-300 mb-2">Account Responsibility:</p>
            <p className="text-gray-300 text-sm">You are solely responsible for all activities under your account, whether authorized or not. Notify us immediately of any unauthorized use.</p>
          </div>
        </section>

        {/* Section 3: Service Description */}
        <section id="service" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">🔮</span>
            3. Service Description
          </h2>
          
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-blue-300 mb-2">About Get The Receipts:</p>
            <p className="text-gray-300 text-sm">Get The Receipts is an AI-powered service that analyzes text messages and communications to provide pattern-based insights, observations, and creative interpretations for personal reflection and entertainment.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-blue-400 font-semibold mb-3">How It Works:</h3>
            <p className="mb-3 text-gray-300">Our AI assistant, Sage, uses advanced language models to:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Analyze linguistic patterns and communication styles in submitted text</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Identify emotional indicators and relationship dynamics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Generate insights based on pattern recognition algorithms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Provide creative interpretations and observations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Offer perspective on communication patterns</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-blue-400 font-semibold mb-3">Intended Use:</h3>
            <p className="mb-3 text-gray-300">The Service is designed for:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Personal entertainment and exploration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Gaining perspective on communication patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Creative insight and reflection</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Understanding relationship dynamics through AI analysis</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="font-semibold text-yellow-300 mb-2">Important Notice:</p>
            <p className="text-gray-300 text-sm">While Get The Receipts uses sophisticated AI technology, it is not a substitute for professional advice. The Service should not be used for medical, legal, financial, or therapeutic decisions.</p>
          </div>
        </section>

        {/* Section 4: Prohibited Uses */}
        <section id="prohibited" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">⛔</span>
            4. Prohibited Uses
          </h2>
          
          <p className="mb-4 text-gray-300">You agree NOT to use the Service for:</p>
          
          <ul className="space-y-3 text-gray-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Any unlawful purpose or in violation of any laws</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Harassment, abuse, or harm to others</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Impersonation of any person or entity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Upload of malicious code, viruses, or harmful content</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Attempts to gain unauthorized access to our systems</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Commercial purposes without our written consent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Scraping, data mining, or use of bots without permission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Submission of others' private information without consent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Making critical life decisions without professional consultation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">⛔</span>
              <span>Any activity that could damage our reputation or operations</span>
            </li>
          </ul>
          
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="font-semibold text-red-300 mb-2">Violation Consequences:</p>
            <p className="text-gray-300 text-sm">We reserve the right to terminate accounts, refuse service, and pursue legal action for violations of these prohibited uses.</p>
          </div>
        </section>

        {/* Section 5: User Content */}
        <section id="content" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">📝</span>
            5. User Content & Intellectual Property
          </h2>
          
          <div className="mb-6">
            <h3 className="text-blue-400 font-semibold mb-3">Your Content:</h3>
            <p className="mb-3 text-gray-300">By submitting content to the Service, you:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Retain ownership of your submitted content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Grant us a limited license to process your content for service delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Warrant that you have the right to submit such content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Agree that we immediately delete your content after processing (see Privacy Policy)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-blue-400 font-semibold mb-3">Our Intellectual Property:</h3>
            <p className="mb-3 text-gray-300">All Service content, including but not limited to:</p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Website design, graphics, and user interface</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Sage character and all related creative elements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Trademarks, logos, and branding</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Software code and algorithms</span>
              </li>
            </ul>
            <p className="text-gray-300">...are owned by Get The Receipts or licensed to us. You may not copy, modify, distribute, or create derivative works without explicit written permission.</p>
          </div>
        </section>

        {/* Section 6: Disclaimers */}
        <section id="disclaimers" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">⚠️</span>
            6. Disclaimers & Limitation of Liability
          </h2>
          
          <div className="bg-red-500/10 border-2 border-red-500 p-4 rounded-lg text-center mb-6">
            <p className="font-bold text-red-300 text-lg">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-red-400 font-semibold mb-3">Service Disclaimers:</h3>
            <p className="mb-3 text-gray-300">Get The Receipts:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Is not a substitute for professional advice (medical, legal, financial, or therapeutic)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Makes no guarantees about accuracy or completeness of AI-generated insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Cannot verify the authenticity or context of submitted content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Provides pattern-based observations, not definitive assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>May produce varied or unexpected interpretations</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-red-400 font-semibold mb-3">Technical Disclaimers:</h3>
            <p className="mb-3 text-gray-300">We do not warrant that:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>The Service will be uninterrupted or error-free</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Defects will be corrected immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>The Service is free of viruses or harmful components</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-1">→</span>
                <span>Results will meet your specific expectations</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-red-400 font-semibold mb-3">Limitation of Liability:</h3>
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="font-semibold text-red-300 mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <p className="text-gray-300 text-sm mb-3">Get The Receipts, its officers, directors, employees, and partners shall NOT be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>Loss of profits, data, use, or goodwill</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>Emotional distress or mental anguish</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>Relationship changes or interpersonal conflicts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>Financial losses or decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>Any damages exceeding $100 USD</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-red-400 font-semibold mb-3">Assumption of Risk:</h3>
            <p className="mb-3 text-gray-300">By using the Service, you acknowledge that:</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>You use the Service entirely at your own risk</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>AI-generated insights are interpretive, not factual</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>You are responsible for how you interpret and act on any outputs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Personal insight services may produce unexpected emotional responses</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 7: Indemnification */}
        <section id="indemnification" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">🛡️</span>
            7. Indemnification
          </h2>
          
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="font-semibold text-blue-300 mb-2">You agree to indemnify, defend, and hold harmless</p>
            <p className="text-gray-300 text-sm">Get The Receipts and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising from:</p>
          </div>
          
          <ul className="space-y-2 text-gray-300 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Your violation of these Terms</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Your use or misuse of the Service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Your violation of any rights of another party</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Your violation of any applicable laws</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Any content you submit to the Service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">→</span>
              <span>Any damages caused by your actions or inactions</span>
            </li>
          </ul>
          
          <p className="text-gray-300 text-sm">This indemnification obligation will survive termination of these Terms and your use of the Service.</p>
        </section>

        {/* Section 8: Termination */}
        <section id="termination" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl">🚪</span>
            8. Account Termination
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-green-400 font-semibold mb-3">Your Right to Terminate:</h3>
              <p className="text-gray-300 text-sm mb-3">You may terminate your account at any time by:</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Using the account deletion feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Contacting sage@getthereceipts.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Ceasing all use of the Service</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/7 transition-colors">
              <h3 className="text-red-400 font-semibold mb-3">Our Right to Terminate:</h3>
              <p className="text-gray-300 text-sm mb-3">We may suspend or terminate your account for:</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Violation of these Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Suspected fraudulent or illegal activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Extended periods of inactivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-1">→</span>
                  <span>Any reason at our sole discretion</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="font-semibold text-blue-300 mb-2">Effect of Termination:</p>
            <p className="text-gray-300 text-sm">Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination will remain in effect.</p>
          </div>
        </section>

        {/* Section 9: Dispute Resolution */}
        <section id="disputes" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl">⚖️</span>
            9. Dispute Resolution
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Governing Law:</h3>
              <p className="text-gray-300">These Terms are governed by applicable laws, without regard to conflict of law principles.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Arbitration Agreement:</h3>
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-lg">
                <p className="font-semibold text-yellow-300 mb-2">PLEASE READ CAREFULLY:</p>
                <p className="text-gray-300 text-sm">You agree that any dispute arising from these Terms or your use of the Service will be resolved through binding arbitration, not in court, except for claims in small claims court.</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Class Action Waiver:</h3>
              <p className="text-gray-300">You agree to resolve disputes only on an individual basis and waive any right to bring or participate in any class action or representative proceeding.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Statute of Limitations:</h3>
              <p className="text-gray-300">Any claim must be filed within one (1) year after the cause of action arises, or be forever barred.</p>
            </div>
          </div>
        </section>

        {/* Section 10: General Provisions */}
        <section id="general" className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-500 rounded-xl flex items-center justify-center text-xl">📋</span>
            10. General Provisions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Modifications to Terms:</h3>
              <p className="text-gray-300">We reserve the right to modify these Terms at any time. Changes become effective upon posting. Continued use constitutes acceptance of modified Terms.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Severability:</h3>
              <p className="text-gray-300">If any provision is found unenforceable, the remaining provisions continue in full force.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Entire Agreement:</h3>
              <p className="text-gray-300">These Terms, along with our Privacy Policy, constitute the entire agreement between you and Get The Receipts.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">No Waiver:</h3>
              <p className="text-gray-300">Our failure to enforce any provision shall not constitute a waiver of that provision.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Assignment:</h3>
              <p className="text-gray-300">You may not assign your rights under these Terms. We may assign our rights to any successor or acquirer.</p>
            </div>
            
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Force Majeure:</h3>
              <p className="text-gray-300">We are not liable for delays or failures due to causes beyond our reasonable control.</p>
            </div>
          </div>
        </section>

        {/* Privacy Reference */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 hover:transform hover:translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">🔒</span>
            Privacy & Data Protection
          </h2>
          <p className="mb-6 text-gray-300">Your privacy is paramount to us. For complete details on our zero-storage architecture and data practices, please review our comprehensive <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>.</p>
          
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="font-semibold text-green-300 mb-2">Key Privacy Features:</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Zero storage of receipts or messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Real-time processing with immediate deletion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>No AI training on your data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold mt-1">✓</span>
                <span>Minimal account information collection</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Final Acceptance */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 rounded-2xl text-center">
          <h3 className="text-green-400 font-bold text-xl mb-6">📝 By Using Get The Receipts You Acknowledge:</h3>
          <div className="max-w-2xl mx-auto text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">1</span>
                <p className="text-gray-300">You have read and understood these Terms</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">2</span>
                <p className="text-gray-300">You are at least 13 years old (or have parental consent if under 18)</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">3</span>
                <p className="text-gray-300">You agree to be legally bound by these Terms</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">4</span>
                <p className="text-gray-300">You understand Sage is an AI assistant providing pattern-based insights</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">5</span>
                <p className="text-gray-300">The Service provides creative analysis for reflection and entertainment</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">6</span>
                <p className="text-gray-300">You accept full responsibility for your use of the Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health Resources */}
        <section className="mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-red-400">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-xl">🆘</span>
            Mental Health and Crisis Safety
          </h2>
          <p className="text-gray-300 mb-4">If you are in emotional distress or experiencing thoughts of self-harm, please immediately contact:</p>
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <ul className="text-gray-300 space-y-2">
              <li>• <strong>US:</strong> Suicide & Crisis Lifeline: 988</li>
              <li>• <strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li>• <strong>International:</strong> <a href="https://findahelpline.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">findahelpline.com</a></li>
            </ul>
          </div>
          <p className="text-gray-300">This site is not therapy or crisis care.</p>
        </section>

        {/* Contact CTA Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 text-white flex items-center justify-center gap-3">
              Questions About These Terms?
            </h2>
            <p className="text-xl text-gray-300 mb-6">We're here to help clarify any concerns about our Terms of Service.</p>
            <a 
              href="mailto:sage@getthereceipts.com" 
              className="inline-block text-blue-400 text-xl font-semibold bg-blue-500/10 border border-blue-500 px-8 py-3 rounded-full hover:bg-blue-500/20 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              sage@getthereceipts.com
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 mb-8">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
        </div>

        {/* Perfect Footer Block */}
        <div className="mt-8 mb-8 p-6 bg-gradient-to-r from-gray-900/60 to-purple-900/40 rounded-2xl border border-gray-600/30">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-3">
              © 2025 Get The Receipts. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              For Entertainment & Insight Purposes Only.<br />
              Sage reads patterns, not people. Trust your gut first. Then verify with us.
            </p>
            <p className="text-gray-500 text-xs mb-3">
              13+ with parental consent • Not therapy, legal, or medical advice • Use at your own risk
            </p>
            <p className="text-gray-500 text-sm">
              Support: <a href="mailto:sage@getthereceipts.com" className="text-purple-400 hover:text-purple-300 transition-colors">sage@getthereceipts.com</a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mb-16">
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;
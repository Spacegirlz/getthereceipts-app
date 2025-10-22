import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service  -  Get The Receipts</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and guidelines for using Get The Receipts AI text analysis service." />
        <meta property="og:title" content="Terms of Service  -  Get The Receipts" />
        <meta property="og:description" content="Read our Terms of Service to understand the rules and guidelines for using Get The Receipts AI text analysis service." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 text-white max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
            <span className="text-blue-400">⚖️</span>
            <span className="text-blue-400 text-sm font-medium">Legal Terms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Terms of Service</h1>
          <p className="text-xl text-gray-300 mb-4">Last Updated: September 21, 2025</p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="space-y-1">
              <p><span className="text-blue-400">1.</span> Acceptance of Terms</p>
              <p><span className="text-blue-400">2.</span> Eligibility & Account Requirements</p>
              <p><span className="text-blue-400">3.</span> Service Description</p>
              <p><span className="text-blue-400">4.</span> Prohibited Uses</p>
              <p><span className="text-blue-400">5.</span> User Content & Intellectual Property</p>
              <p><span className="text-blue-400">6.</span> Payments, Subscriptions & Refunds</p>
            </div>
            <div className="space-y-1">
              <p><span className="text-blue-400">7.</span> Affiliate Program</p>
              <p><span className="text-blue-400">8.</span> Disclaimers & Limitation of Liability</p>
              <p><span className="text-blue-400">9.</span> Indemnification</p>
              <p><span className="text-blue-400">10.</span> Account Termination</p>
              <p><span className="text-blue-400">11.</span> Dispute Resolution</p>
              <p><span className="text-blue-400">12.</span> General Provisions</p>
            </div>
          </div>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">1</span>
            Acceptance of Terms
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," "your") and Get The Receipts ("we," "us," "our") governing your access to and use of getthereceipts.com and all related services (collectively, the "Service").
          </p>
          <div className="space-y-4">
            <p className="text-gray-300">By accessing or using the Service, you agree to be bound by these Terms.</p>
            <p className="text-gray-300">If you do not agree to all provisions, you must immediately discontinue use of the Service.</p>
            <p className="text-gray-300">These Terms incorporate by reference our Privacy Policy, Refund Policy, and any other policies posted on our Service.</p>
          </div>
        </section>

        {/* 2. Eligibility & Account Requirements */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">2</span>
            Eligibility & Account Requirements
          </h2>
          
          <div className="mb-6 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-red-300 mb-3">Age Requirement</h3>
            <p className="text-lg text-white font-semibold mb-2">YOU MUST BE AT LEAST 16 YEARS OLD TO USE THIS SERVICE</p>
            <p className="text-gray-300">
              We have implemented comprehensive safety measures throughout our platform, including content filtering and prominent safety notices on every page. Users aged 16-17 may use the Service, though we encourage parental guidance given the personal nature of relationship analysis.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">User Representations</h3>
            <p className="text-gray-300 mb-4">By using the Service, you represent and warrant that:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• You are at least 16 years of age</li>
              <li>• You have the legal capacity to enter into binding agreements</li>
              <li>• You are not prohibited from using the Service under applicable laws</li>
              <li>• You will provide accurate and complete registration information</li>
              <li>• You will maintain the security of your account credentials</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Account Responsibility</h3>
            <p className="text-gray-300">
              You are solely responsible for all activities under your account, whether authorized or not. Notify us immediately at <a href="mailto:support@getthereceipts.com" className="text-blue-400 hover:text-blue-300">support@getthereceipts.com</a> of any unauthorized use.
            </p>
          </div>
        </section>

        {/* 3. Service Description */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">3</span>
            Service Description
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">About Get The Receipts</h3>
            <p className="text-lg text-gray-300">
              Get The Receipts is an AI-powered service that analyzes text messages and communications to provide pattern-based insights, observations, and creative interpretations for personal reflection and entertainment.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
            <p className="text-gray-300 mb-4">Our AI assistant, Sage, uses advanced language models to:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Analyze linguistic patterns and communication styles in submitted text</li>
              <li>• Identify emotional indicators and relationship dynamics</li>
              <li>• Generate insights based on pattern recognition algorithms</li>
              <li>• Provide creative interpretations and observations</li>
              <li>• Offer perspective on communication patterns</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Intended Use</h3>
            <p className="text-gray-300 mb-4">The Service is designed for:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Personal entertainment and exploration</li>
              <li>• Gaining perspective on communication patterns</li>
              <li>• Creative insight and reflection</li>
              <li>• Understanding relationship dynamics through AI analysis</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Important Notice</h3>
            <p className="text-gray-300">
              While Get The Receipts uses sophisticated AI technology, it is not a substitute for professional advice. The Service should not be used for medical, legal, financial, or therapeutic decisions.
            </p>
          </div>
        </section>

        {/* 4. Prohibited Uses */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">4</span>
            Prohibited Uses
          </h2>
          <p className="text-lg text-gray-300 mb-6">You agree NOT to use the Service for:</p>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li>• Any unlawful purpose or in violation of any laws</li>
            <li>• Harassment, abuse, or harm to others</li>
            <li>• Impersonation of any person or entity</li>
            <li>• Upload of malicious code, viruses, or harmful content</li>
            <li>• Attempts to gain unauthorized access to our systems</li>
            <li>• Commercial purposes without our written consent</li>
            <li>• Scraping, data mining, or use of bots without permission</li>
            <li>• Submission of others' private information without consent</li>
            <li>• Making critical life decisions without professional consultation</li>
            <li>• Any activity that could damage our reputation or operations</li>
            <li>• Circumventing or attempting to circumvent any security measures</li>
            <li>• Creating multiple accounts to abuse free services or promotions</li>
          </ul>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Violation Consequences</h3>
            <p className="text-gray-300">
              We reserve the right to terminate accounts, refuse service, and pursue legal action for violations of these prohibited uses.
            </p>
          </div>
        </section>

        {/* 5. User Content & Intellectual Property */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">5</span>
            User Content & Intellectual Property
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Content</h3>
            <p className="text-gray-300 mb-4">By submitting content to the Service, you:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Retain ownership of your submitted content</li>
              <li>• Grant us a limited, temporary license to process your content for service delivery only</li>
              <li>• Warrant that you have the right to submit such content</li>
              <li>• Acknowledge that we immediately delete your content after processing (see Privacy Policy)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Our Intellectual Property</h3>
            <p className="text-gray-300 mb-4">All Service content, including but not limited to:</p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li>• Website design, graphics, and user interface</li>
              <li>• Sage character and all related creative elements</li>
              <li>• Trademarks, logos, and branding</li>
              <li>• Software code and algorithms</li>
            </ul>
            <p className="text-gray-300">
              ...are owned by Get The Receipts or licensed to us. You may not copy, modify, distribute, or create derivative works without explicit written permission.
            </p>
          </div>
        </section>

        {/* 6. Payments, Subscriptions & Refunds */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">6</span>
            Payments, Subscriptions & Refunds
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Payment Processing</h3>
            <p className="text-gray-300">
              We offer both free and paid features. All payments are processed securely through Stripe-we never see or store your payment information.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Subscriptions</h3>
            <p className="text-gray-300 mb-4">If you choose a subscription plan:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• It will automatically renew unless you cancel</li>
              <li>• You can cancel anytime through your account settings or by contacting support</li>
              <li>• Cancellation takes effect at the end of your current billing period</li>
              <li>• You'll continue to have access to paid features until that period ends</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Refunds</h3>
            <p className="text-gray-300">
              All purchases are subject to our Refund Policy, which includes a 7-day satisfaction guarantee and provisions for technical issues. Please review our <Link to="/refund-policy" className="text-blue-400 hover:text-blue-300 underline">Refund Policy</Link> for complete details.
            </p>
          </div>
        </section>

        {/* 7. Affiliate Program */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">7</span>
            Affiliate Program
          </h2>
          
          <div className="mb-6">
            <p className="text-lg text-gray-300 mb-4">
              We operate an affiliate program through Rewardful, a third-party affiliate management service.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Affiliate Terms</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Affiliates may earn commissions for referring new users to our paid services</li>
              <li>• All affiliate activities must comply with these Terms of Service</li>
              <li>• Affiliates must disclose their relationship with Get The Receipts in accordance with applicable advertising standards</li>
              <li>• We reserve the right to terminate affiliate relationships for violations of our terms or policies</li>
              <li>• Affiliate payments and terms are managed through Rewardful's platform and subject to their terms of service</li>
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Prohibited Affiliate Activities</h3>
            <p className="text-gray-300 mb-2">Affiliates may not:</p>
            <ul className="space-y-1 text-gray-300">
              <li>• Use misleading or false advertising to promote our Service</li>
              <li>• Engage in spam or unsolicited marketing</li>
              <li>• Bid on our trademarked terms in search advertising</li>
              <li>• Violate any applicable laws or regulations in their promotional activities</li>
            </ul>
          </div>
        </section>

        {/* 8. Disclaimers & Limitation of Liability */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">8</span>
            Disclaimers & Limitation of Liability
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Service Disclaimers</h3>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-red-300 mb-2">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</p>
            </div>
            <p className="text-gray-300 mb-4">Get The Receipts:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Is not a substitute for professional advice (medical, legal, financial, or therapeutic)</li>
              <li>• Makes no guarantees about accuracy or completeness of AI-generated insights</li>
              <li>• Cannot verify the authenticity or context of submitted content</li>
              <li>• Provides pattern-based observations, not definitive assessments</li>
              <li>• May produce varied or unexpected interpretations</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Technical Disclaimers</h3>
            <p className="text-gray-300 mb-4">We do not warrant that:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• The Service will be uninterrupted or error-free</li>
              <li>• Defects will be corrected immediately</li>
              <li>• The Service is free of viruses or harmful components</li>
              <li>• Results will meet your specific expectations</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h3>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-red-300 mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            </div>
            <p className="text-gray-300 mb-4">
              Get The Receipts, its officers, directors, employees, and partners shall NOT be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Loss of profits, data, use, or goodwill</li>
              <li>• Emotional distress or mental anguish</li>
              <li>• Relationship changes or interpersonal conflicts</li>
              <li>• Financial losses or decisions</li>
              <li>• Any damages exceeding AUD $100</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Assumption of Risk</h3>
            <p className="text-gray-300 mb-2">By using the Service, you acknowledge that:</p>
            <ul className="space-y-1 text-gray-300 mb-2">
              <li>• You use the Service entirely at your own risk</li>
              <li>• AI-generated insights are interpretive, not factual</li>
              <li>• You are responsible for how you interpret and act on any outputs</li>
              <li>• Personal insight services may produce unexpected emotional responses</li>
            </ul>
            <p className="text-gray-300 text-sm">
              This limitation doesn't apply to our gross negligence or willful misconduct, and doesn't limit any rights you may have under Australian Consumer Law.
            </p>
          </div>
        </section>

        {/* 9. Indemnification */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">9</span>
            Indemnification
          </h2>
          <p className="text-lg text-gray-300 mb-4">
            You agree to indemnify, defend, and hold harmless Get The Receipts and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising from:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>• Your violation of these Terms</li>
            <li>• Your use or misuse of the Service</li>
            <li>• Your violation of any rights of another party</li>
            <li>• Your violation of any applicable laws</li>
            <li>• Any content you submit to the Service</li>
            <li>• Any damages caused by your actions or inactions</li>
          </ul>
          <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300">
              This indemnification obligation will survive termination of these Terms and your use of the Service.
            </p>
          </div>
        </section>

        {/* 10. Account Termination */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">10</span>
            Account Termination
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Right to Terminate</h3>
            <p className="text-gray-300 mb-4">You may terminate your account at any time by:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Using the account deletion feature in your account settings</li>
              <li>• Contacting support@getthereceipts.com</li>
              <li>• Ceasing all use of the Service</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Our Right to Terminate</h3>
            <p className="text-gray-300 mb-4">We may suspend or terminate your account for:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Violation of these Terms</li>
              <li>• Suspected fraudulent or illegal activity</li>
              <li>• Extended periods of inactivity</li>
              <li>• Any reason at our sole discretion, with or without notice</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Effect of Termination</h3>
            <p className="text-gray-300">
              Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination will remain in effect, including indemnification, limitation of liability, and dispute resolution clauses.
            </p>
          </div>
        </section>

        {/* 11. Dispute Resolution */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">11</span>
            Dispute Resolution
          </h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Governing Law</h3>
            <p className="text-gray-300">
              These Terms are governed by the laws of Australia, without regard to conflict of law principles. We comply with Australian Consumer Law and other applicable Australian regulations.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Dispute Resolution Process</h3>
            <p className="text-gray-300 mb-4">
              We encourage users to contact us first to resolve any disputes at support@getthereceipts.com. If a dispute cannot be resolved through direct communication, disputes may be resolved through:
            </p>
            <ol className="space-y-2 text-gray-300">
              <li>1. Mediation through an appropriate Australian dispute resolution service</li>
              <li>2. Australian courts with jurisdiction, subject to Australian Consumer Law protections</li>
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Class Action Waiver</h3>
            <p className="text-gray-300">
              You agree to resolve disputes only on an individual basis and waive any right to bring or participate in any class action or representative proceeding, except where prohibited by law.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Statute of Limitations</h3>
            <p className="text-gray-300 mb-2">
              Any claim must be filed within one (1) year after the cause of action arises, or be forever barred.
            </p>
            <p className="text-gray-300 text-sm">
              Note: Australian Consumer Law provides certain guarantees and rights that cannot be excluded, and this clause does not limit those statutory rights.
            </p>
          </div>
        </section>

        {/* 12. General Provisions */}
        <section className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">12</span>
            General Provisions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Modifications to Terms</h3>
              <p className="text-gray-300">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by email or through a prominent notice on our website. Changes become effective upon posting. Continued use constitutes acceptance of modified Terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Severability</h3>
              <p className="text-gray-300">
                If any provision is found unenforceable, the remaining provisions continue in full force and effect.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Entire Agreement</h3>
              <p className="text-gray-300">
                These Terms, along with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Get The Receipts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">No Waiver</h3>
              <p className="text-gray-300">
                Our failure to enforce any provision shall not constitute a waiver of that provision.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Assignment</h3>
              <p className="text-gray-300">
                You may not assign your rights under these Terms. We may assign our rights to any successor or acquirer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Force Majeure</h3>
              <p className="text-gray-300">
                We are not liable for delays or failures due to causes beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, strikes, or government actions.
              </p>
            </div>
          </div>
        </section>

        {/* Mental Health and Crisis Safety */}
        <section className="mb-12 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">🆘</span>
            Mental Health and Crisis Safety
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This service is for entertainment and personal insight only and is not a substitute for professional advice. If you are in emotional distress or experiencing thoughts of self-harm, please immediately contact:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">Australia:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Lifeline: 13 11 14</li>
                <li>• Beyond Blue: 1300 22 4636</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">US:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Suicide & Crisis Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-3">International:</h3>
              <p className="text-gray-300">
                Visit <a href="https://findahelpline.com" className="text-blue-400 hover:text-blue-300 underline">findahelpline.com</a>
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-red-500/20 rounded-lg">
            <p className="text-red-200 font-semibold text-center">
              This site is not therapy or crisis care.
            </p>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="mb-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">By Using Get The Receipts You Acknowledge:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-300">
              <li>1. You have read and understood these Terms</li>
              <li>2. You are at least 16 years old</li>
              <li>3. You agree to be legally bound by these Terms</li>
            </ul>
            <ul className="space-y-2 text-gray-300">
              <li>4. You understand Sage is an AI assistant providing pattern-based insights</li>
              <li>5. The Service provides creative analysis for reflection and entertainment</li>
              <li>6. You accept full responsibility for your use of the Service</li>
            </ul>
          </div>
        </section>

        {/* Contact CTA Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 text-white flex items-center justify-center gap-3">
              Questions About These Terms?
            </h2>
            <p className="text-xl text-gray-300 mb-6">We're here to help clarify any concerns:</p>
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
            <p className="text-gray-500 text-xs mb-2">For Entertainment Purposes Only</p>
            
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

export default TermsOfServicePage;
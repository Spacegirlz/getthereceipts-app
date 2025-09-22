import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AffiliateTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📜 Affiliate Program Terms and Conditions
            </h1>
            <p className="text-purple-200 text-lg">
              Effective Date: October 1, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">1. AGREEMENT</h2>
              <p className="text-gray-200 leading-relaxed">
                These Affiliate Program Terms and Conditions (the "Agreement") constitute a legal agreement between Get The Receipts ("Company," "we," "us," or "our") and you ("Affiliate," "you," or "your"). By participating in the Get The Receipts Affiliate Program (the "Program"), you agree to be bound by these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">2. ENROLLMENT AND ELIGIBILITY</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>2.1.</strong> You must be at least 18 years of age to participate in the Program.</p>
                <p><strong>2.2.</strong> You must provide accurate and complete information in your application.</p>
                <p><strong>2.3.</strong> We reserve the right to accept or reject any application at our sole discretion.</p>
                <p><strong>2.4.</strong> You may not participate if you are located in a jurisdiction where this Program would be prohibited.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">3. AFFILIATE RELATIONSHIP</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>3.1.</strong> As an Affiliate, you are an independent contractor, not an employee, agent, or partner of Get The Receipts.</p>
                <p><strong>3.2.</strong> You have no authority to make any commitments on behalf of Get The Receipts.</p>
                <p><strong>3.3.</strong> You are responsible for your own taxes on commission income.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">4. COMMISSION STRUCTURE</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>4.1.</strong> Commission Rate: 30% of net sales (excluding taxes, refunds, and chargebacks).</p>
                <p><strong>4.2.</strong> Commission Duration: Commissions are paid for the first 6 payments per customer OR for 12 months from the first sale, whichever comes first.</p>
                <p><strong>4.3.</strong> Hold Period: All commissions are subject to a 30-day hold period before becoming payable.</p>
                <p><strong>4.4.</strong> Minimum Payout: $50 USD. Amounts below this threshold roll over to the next payment period.</p>
                <p><strong>4.5.</strong> Payment Schedule: Monthly payments on or around the 1st of each month for eligible commissions.</p>
                <p><strong>4.6.</strong> Payment Method: PayPal or other methods as designated by Company.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">5. REFERRAL TRACKING</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>5.1.</strong> Referrals are tracked using cookies with a 60-day attribution window.</p>
                <p><strong>5.2.</strong> You will receive credit for sales made within 60 days of a user clicking your unique affiliate link.</p>
                <p><strong>5.3.</strong> We use Rewardful for tracking and reserve the right to determine attribution in cases of dispute.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">6. PROMOTIONAL GUIDELINES</h2>
              <div className="text-gray-200 leading-relaxed">
                <p className="mb-4"><strong>You MAY:</strong></p>
                <ul className="list-disc list-inside space-y-1 mb-6">
                  <li>Share your honest experience with Get The Receipts</li>
                  <li>Create original content featuring the service</li>
                  <li>Use approved marketing materials</li>
                  <li>Promote on social media, blogs, email newsletters</li>
                </ul>
                
                <p className="mb-4"><strong>You may NOT:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make false or misleading claims about our service</li>
                  <li>Use spam or unsolicited email marketing</li>
                  <li>Impersonate Get The Receipts or create confusion about your relationship with us</li>
                  <li>Bid on our trademarks in paid advertising without written permission</li>
                  <li>Use your affiliate link to make personal purchases (self-referrals)</li>
                  <li>Incentivize clicks or purchases in ways that manipulate the Program</li>
                  <li>Target or market to individuals under 18 years of age</li>
                  <li>Create content that is offensive, discriminatory, or harmful</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">7. FTC DISCLOSURE REQUIREMENTS</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>7.1.</strong> You MUST clearly disclose your affiliate relationship when promoting Get The Receipts.</p>
                <p><strong>7.2.</strong> Disclosures must be clear, conspicuous, and placed before any affiliate links.</p>
                <p><strong>7.3.</strong> Examples of acceptable disclosures:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>"Affiliate link"</li>
                  <li>"I earn commission from this link"</li>
                  <li>"Paid partnership with Get The Receipts"</li>
                </ul>
                <p><strong>7.4.</strong> Failure to properly disclose is grounds for immediate termination.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">8. INTELLECTUAL PROPERTY</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>8.1.</strong> We grant you a limited, non-exclusive, revocable license to use our trademarks and materials solely for Program promotion.</p>
                <p><strong>8.2.</strong> You may not modify our logos or trademarks without permission.</p>
                <p><strong>8.3.</strong> All rights to Get The Receipts intellectual property remain with us.</p>
                <p><strong>8.4.</strong> Upon termination, you must immediately cease using our intellectual property.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">9. COMMISSION REVERSALS</h2>
              <p className="text-gray-200 leading-relaxed mb-2">We reserve the right to reverse commissions for:</p>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>Refunded or cancelled orders</li>
                <li>Chargebacks or payment disputes</li>
                <li>Fraudulent transactions</li>
                <li>Violations of these terms</li>
                <li>Self-referrals or artificial inflation of sales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">10. TERMINATION</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>10.1.</strong> Either party may terminate this Agreement at any time with written notice.</p>
                <p><strong>10.2.</strong> We may terminate immediately for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violation of these terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Damage to our reputation</li>
                  <li>Inactivity for 180 days</li>
                  <li>Any activity we deem harmful to our business</li>
                </ul>
                <p><strong>10.3.</strong> Upon termination:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Your affiliate links will be deactivated</li>
                  <li>Pending eligible commissions will be paid per normal schedule</li>
                  <li>Commissions may be forfeited if termination is for cause</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">11. LIMITATION OF LIABILITY</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>11.1.</strong> Get The Receipts shall not be liable for indirect, incidental, special, or consequential damages.</p>
                <p><strong>11.2.</strong> Our total liability shall not exceed the total commissions paid to you in the preceding 6 months.</p>
                <p><strong>11.3.</strong> We make no guarantees about potential earnings or Program availability.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">12. INDEMNIFICATION</h2>
              <p className="text-gray-200 leading-relaxed">
                You agree to indemnify and hold harmless Get The Receipts, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:
              </p>
              <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2">
                <li>Your breach of this Agreement</li>
                <li>Your promotional activities</li>
                <li>Your violation of any laws or third-party rights</li>
                <li>Content you create or distribute</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">13. CONFIDENTIALITY</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>13.1.</strong> You agree to keep confidential any non-public information about our business, including commission rates specific to you, conversion data, or business strategies.</p>
                <p><strong>13.2.</strong> This obligation survives termination of this Agreement.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">14. MODIFICATIONS</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>14.1.</strong> We may modify these terms with 30 days notice.</p>
                <p><strong>14.2.</strong> Continued participation after modifications constitutes acceptance.</p>
                <p><strong>14.3.</strong> We will notify you of material changes via email.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">15. PROHIBITED JURISDICTIONS</h2>
              <p className="text-gray-200 leading-relaxed">
                You may not participate if you reside in jurisdictions where affiliate marketing is prohibited or restricted without proper licensing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">16. DISPUTE RESOLUTION</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>16.1.</strong> Any disputes shall first be addressed through good-faith negotiation.</p>
                <p><strong>16.2.</strong> If unresolved, disputes shall be settled through arbitration in Melbourne, Australia.</p>
                <p><strong>16.3.</strong> The prevailing party may recover reasonable attorneys' fees.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">17. GENERAL PROVISIONS</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>17.1.</strong> Governing Law: This Agreement is governed by the laws of Australia</p>
                <p><strong>17.2.</strong> Entire Agreement: This constitutes the entire agreement between parties.</p>
                <p><strong>17.3.</strong> Severability: If any provision is invalid, the remainder continues in force.</p>
                <p><strong>17.4.</strong> Assignment: You may not assign this Agreement without our written consent.</p>
                <p><strong>17.5.</strong> Electronic Agreement: You agree that electronic acceptance constitutes binding agreement.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">18. PRIVACY</h2>
              <div className="text-gray-200 leading-relaxed space-y-2">
                <p><strong>18.1.</strong> Your personal information will be handled per our Privacy Policy.</p>
                <p><strong>18.2.</strong> We may share your information with Rewardful for Program administration.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">19. EARNINGS DISCLAIMER</h2>
              <p className="text-gray-200 leading-relaxed">
                Individual results vary. Earnings depend on effort, audience, and market factors. We make no guarantees of income. Examples of earnings are not typical and are not guarantees of future performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">20. CONTACT INFORMATION</h2>
              <p className="text-gray-200 leading-relaxed mb-2">For questions about these terms or the Program:</p>
              <div className="text-gray-200 space-y-1">
                <p><strong>Get The Receipts</strong></p>
                <p>Email: <a href="mailto:affiliates@getthereceipts.com" className="text-purple-300 hover:text-purple-200 transition-colors">affiliates@getthereceipts.com</a></p>
                <p>Website: <a href="https://www.getthereceipts.com" className="text-purple-300 hover:text-purple-200 transition-colors">https://www.getthereceipts.com</a></p>
              </div>
            </section>

            {/* Agreement Statement */}
            <div className="mt-12 p-6 bg-purple-500/10 border border-purple-400/30 rounded-xl">
              <p className="text-center text-lg font-semibold text-purple-200">
                BY PARTICIPATING IN THE PROGRAM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-purple-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🔮</span>
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-bold text-xl">
                  Get The Receipts
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Your AI bestie with opinions. Decode any text message instantly and get the receipts on what they really meant.
              </p>
              <p className="text-gray-500 text-sm">
                For 16+ Entertainment Purposes Only. Sage is an AI character with opinions, not facts. Her takes are for fun and perspective, not professional advice.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/affiliate-terms" className="text-gray-400 hover:text-white transition-colors">Affiliate Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Get The Receipts. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

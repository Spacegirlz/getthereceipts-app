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
        <h1 className="text-4xl md:text-5xl font-black mb-6 gradient-text">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last Updated: August 25, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">1. Agreement to Terms</h2>
          <p className="mb-3">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Get The Receipts ("we," "us," or "our"), concerning your access to and use of the <Link to="https://getthereceipts.com" className="text-purple-400 hover:text-purple-300 transition-colors">getthereceipts.com</Link> website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Service").
          </p>
          <p>
            You agree that by accessing the Service, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">2. Use of the Service</h2>
          <h3 className="text-xl font-semibold mb-2">Purpose of Service:</h3>
          <p className="mb-3">
            The Get The Receipts Service is provided for entertainment purposes only. The analyses provided are satirical and should not be taken as professional advice or a definitive interpretation of real-life communications.
          </p>
          <h3 className="text-xl font-semibold mb-2">User Conduct:</h3>
          <p className="mb-3">
            You agree not to use the Service for any unlawful purpose or in any way that might harm, abuse, or harass any person or entity. You are responsible for all activity that occurs under your account.
          </p>
          <h3 className="text-xl font-semibold mb-2">Age Restriction:</h3>
          <p className="mb-3">
            The Service is not intended for users under the age of 18. By using the Service, you confirm that you are at least 18 years old.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">3. Intellectual Property Rights</h2>
          <p className="mb-3">
            Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Service (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>
          <p>
            The Content and Marks are provided on the Service "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the Service and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">4. Disclaimers</h2>
          <p className="mb-3">
            THE SERVICE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICE WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICE'S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SERVICE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">5. Limitation of Liability</h2>
          <p className="mb-3">
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">6. Modifications to Terms</h2>
          <p className="mb-3">
            We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of these Terms of Service, and you waive any right to receive specific notice of each such change.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3">7. Contact Us</h2>
          <p className="mb-3">If you have questions or comments about these Terms of Service, please contact us at:</p>
          <p className="font-semibold">Email: <a href="mailto:support@getthereceipts.com" className="text-purple-400 hover:text-purple-300 transition-colors">support@getthereceipts.com</a></p>
        </section>

        <div className="mt-12 text-center">
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;
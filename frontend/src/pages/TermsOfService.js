export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <p>
          Welcome to AntiqueXX. By accessing or using our website, apps, or services (the “Services”), you agree to these Terms of Service.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-white">1. Accounts & Eligibility</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>You must be at least 18 years old (or the age of majority in your jurisdiction).</li>
            <li>Provide accurate information and keep your account secure.</li>
            <li>We may suspend or terminate accounts for policy violations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Auctions & Bidding</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Bids are binding. Placing a bid is a commitment to purchase if you win.</li>
            <li>Some listings may have reserve prices, soft-close, or proxy bidding.</li>
            <li>Winners must complete payment within the specified timeframe.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Sellers & Listings</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Sellers must accurately describe items and comply with applicable laws.</li>
            <li>Counterfeits, stolen property, and prohibited items are not allowed.</li>
            <li>We may remove or moderate listings at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Fees, Taxes, and Payments</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Fees and applicable taxes/VAT may apply and will be disclosed at checkout.</li>
            <li>Payment processing may be handled by third-party providers.</li>
            <li>Chargebacks, disputes, and refunds are governed by our Refund Policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Shipping & Risk</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Shipping options and insurance may be available; risk passes upon delivery as per carrier terms.</li>
            <li>Customs duties and import taxes are the buyer’s responsibility unless otherwise stated.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. User Content & IP</h2>
          <p className="mt-2">You grant AntiqueXX a non-exclusive license to display content you submit. See our Copyright/IP Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Prohibited Conduct</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Fraud, shill bidding, harassment, or attempts to circumvent fees.</li>
            <li>Reverse engineering or misuse of the Services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">8. Disclaimers & Liability</h2>
          <p className="mt-2">Services are provided “as is”. To the extent permitted by law, AntiqueXX is not liable for indirect or consequential damages.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">9. Disputes & Governing Law</h2>
          <p className="mt-2">Disputes will be resolved under the laws of the applicable jurisdiction indicated on our Contact/Legal page.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">10. Changes</h2>
          <p className="mt-2">We may update these Terms. Material changes will be notified via the site or email.</p>
        </section>
      </div>
    </div>
  );
}

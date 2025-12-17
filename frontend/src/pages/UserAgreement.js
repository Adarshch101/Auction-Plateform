export default function UserAgreement() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">User Agreement</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Your Responsibilities</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide accurate account information and keep it up to date.</li>
            <li>Comply with applicable laws and our policies when buying or selling.</li>
            <li>Respect other users and refrain from abusive or fraudulent behavior.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Platform Use</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Do not circumvent fees or interfere with the operation of the Services.</li>
            <li>Do not post prohibited items or infringing content.</li>
            <li>We may limit, suspend, or terminate accounts to protect the community.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Transactions</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Bids and purchases are binding; pay within the required period if you win.</li>
            <li>Disputes and returns follow our Refund Policy and applicable law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Privacy & Data</h2>
          <p className="mt-2">Your use of the Services is also governed by our Privacy Policy and Cookie Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Changes</h2>
          <p className="mt-2">We may update this Agreement; continued use after changes constitutes acceptance.</p>
        </section>
      </div>
    </div>
  );
}

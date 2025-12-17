export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Refund & Returns Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Auction Purchases</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>All winning bids are final. Returns are generally not accepted unless the item is materially misdescribed or arrives damaged.</li>
            <li>Claims must be submitted within 72 hours of delivery with supporting evidence (photos, description).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Fixed-Price Purchases</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Eligible items may be returned within 7–14 days (as specified on the listing) in original condition and packaging.</li>
            <li>Buyer may be responsible for return shipping unless the item is defective/misdescribed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Refund Method</h2>
          <p className="mt-2">Approved refunds are issued to the original payment method. Processing times may vary by provider.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Exceptions</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Items sold “as-is” or described with known defects.</li>
            <li>Customs delays/fees not caused by the seller.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. How to Start a Return</h2>
          <p className="mt-2">Contact support@antiquexx.com with your order ID, photos, and a description of the issue.</p>
        </section>
      </div>
    </div>
  );
}

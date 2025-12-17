export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <p>
          This Privacy Policy explains how AntiqueXX collects, uses, and protects your information when you use our Services.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Account data: name, email, phone, address.</li>
            <li>Usage data: pages viewed, actions (bids, listings), device and log data.</li>
            <li>Payment data: processed by payment providers; we store limited metadata.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. How We Use Information</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide and improve the Services (auctions, payments, support).</li>
            <li>Fraud prevention, security, and compliance with legal obligations.</li>
            <li>Communications: transactional emails, service updates, and optional marketing (with consent where required).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Cookies & Tracking</h2>
          <p className="mt-2">We use cookies and similar technologies for authentication, analytics, and personalization. See our Cookie Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Sharing</h2>
          <p className="mt-2">We share data with service providers (e.g., payments, hosting, analytics) under contractual safeguards. We may disclose if required by law or to protect rights.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. International Transfers</h2>
          <p className="mt-2">Data may be processed in other countries. Where applicable, we use appropriate safeguards (e.g., standard contractual clauses).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Access, correction, deletion, and portability, subject to law.</li>
            <li>Object to or restrict certain processing.</li>
            <li>Opt-out of marketing at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Data Security & Retention</h2>
          <p className="mt-2">We implement technical and organizational measures to protect data and retain it only as long as necessary for the stated purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">8. Contact</h2>
          <p className="mt-2">Questions? Contact us at support@antiquexx.com.</p>
        </section>
      </div>
    </div>
  );
}

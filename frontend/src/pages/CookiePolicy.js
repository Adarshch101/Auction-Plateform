export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <p>
          This Cookie Policy explains how AntiqueXX uses cookies and similar technologies on our Services.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-white">1. What Are Cookies?</h2>
          <p className="mt-2">Small text files stored on your device to remember settings and preferences and to enable core functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Types We Use</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Strictly necessary (authentication, security).</li>
            <li>Preferences (language, currency).</li>
            <li>Analytics (usage and performance).</li>
            <li>Marketing (subject to consent where required).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Managing Cookies</h2>
          <p className="mt-2">You can manage cookies via your browser settings. Disabling some cookies may affect site functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Do Not Track</h2>
          <p className="mt-2">We currently do not respond to Do Not Track signals due to a lack of industry standards.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Contact</h2>
          <p className="mt-2">For questions, contact support@antiquexx.com.</p>
        </section>
      </div>
    </div>
  );
}

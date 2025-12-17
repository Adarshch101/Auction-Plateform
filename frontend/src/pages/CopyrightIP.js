export default function CopyrightIP() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Copyright & Intellectual Property</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Ownership</h2>
          <p className="mt-2">All site content, branding, and technology are owned by AntiqueXX or its licensors and are protected by IP laws.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Seller Content</h2>
          <p className="mt-2">Sellers retain rights in their content but grant AntiqueXX a license to host, display, and promote listings across our Services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Prohibited Content</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Counterfeit, infringing, or unauthorized reproductions.</li>
            <li>Misuse of trademarks or other third-party rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. DMCA / Takedown</h2>
          <p className="mt-2">To report infringement, email support@antiquexx.com with: your contact info, the work claimed infringed, the infringing material URL, and a good-faith statement.</p>
        </section>
      </div>
    </div>
  );
}

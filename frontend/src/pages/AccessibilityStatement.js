export default function AccessibilityStatement() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Accessibility Statement</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-300">
        <p>
          AntiqueXX is committed to making our Services accessible to everyone, including people with disabilities. We aim to conform to WCAG 2.1 AA where feasible.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-white">1. Our Commitment</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Use semantic HTML and ARIA where appropriate.</li>
            <li>Maintain sufficient color contrast and visible focus states.</li>
            <li>Support keyboard and screen-reader navigation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Ongoing Improvements</h2>
          <p className="mt-2">We regularly audit pages and components, and welcome feedback to improve accessibility.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Contact</h2>
          <p className="mt-2">If you experience any barriers, contact us at accessibility@antiquexx.com or support@antiquexx.com.</p>
        </section>
      </div>
    </div>
  );
}

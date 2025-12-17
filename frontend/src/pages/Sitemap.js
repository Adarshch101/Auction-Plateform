import { Link } from "react-router-dom";

export default function Sitemap() {
  const sections = [
    {
      title: 'Company',
      links: [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/support', label: 'Support' },
      ],
    },
    {
      title: 'Auctions',
      links: [
        { to: '/auctions', label: 'All Auctions' },
        { to: '/compare', label: 'Compare' },
        { to: '/wishlist', label: 'Wishlist' },
      ],
    },
    {
      title: 'Help',
      links: [
        { to: '/help/buying', label: 'Buying Guide' },
        { to: '/help/buyer-protection', label: 'Buyer Protection' },
        { to: '/help/seller-handbook', label: 'Seller Handbook' },
        { to: '/seller/how-it-works', label: 'How Seller Works' },
      ],
    },
    {
      title: 'Seller',
      links: [
        { to: '/seller/join', label: 'Become a Seller' },
        { to: '/seller/commission-info', label: 'Commission Info' },
        { to: '/seller/shipping-policies', label: 'Shipping Policies' },
        { to: '/seller/rankings', label: 'Seller Rankings' },
      ],
    },
    {
      title: 'Collections & Curations',
      links: [
        { to: '/collections/astral', label: 'Astral Collections' },
        { to: '/collections/timeless-relics', label: 'Timeless Relics' },
        { to: '/collections/intergalactic-artifacts', label: 'Intergalactic Artifacts' },
        { to: '/curations/cosmic', label: 'Cosmic Curations' },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
        { to: '/profile', label: 'Profile' },
        { to: '/wallet', label: 'Wallet' },
        { to: '/saved-searches', label: 'Saved Searches' },
        { to: '/notifications', label: 'Notifications' },
      ],
    },
    {
      title: 'Legal & Policies',
      links: [
        { to: '/legal/terms', label: 'Terms of Service' },
        { to: '/legal/privacy', label: 'Privacy Policy' },
        { to: '/legal/cookies', label: 'Cookie Policy' },
        { to: '/legal/refunds', label: 'Refund Policy' },
        { to: '/legal/copyright', label: 'Copyright / IP' },
        { to: '/legal/user-agreement', label: 'User Agreement' },
        { to: '/legal/accessibility', label: 'Accessibility Statement' },
      ],
    },
    {
      title: 'Utilities',
      links: [
        { to: '/sitemap', label: 'Sitemap' },
        { to: '/recently-viewed', label: 'Recently Viewed' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((sec) => (
          <div key={sec.title}>
            <h2 className="text-lg font-semibold text-white mb-3">{sec.title}</h2>
            <ul className="space-y-1">
              {sec.links.map((l) => (
                <li key={l.to}>
                  <Link className="text-cyan-400 hover:underline" to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import SellerSidebar from "./SellerSidebar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { Link } from "react-router-dom";

export default function SellerLayout({ children }) {
  const { auth } = useContext(AuthContext);
  const { settings } = useSettings();
  const showKycBanner = settings?.requireKYCForSellers && auth?.role === "seller" && !auth?.kycVerified;

  return (
    <div className="flex h-screen">
      <SellerSidebar />
      <main className="flex-1 pl-0 pt-20 overflow-y-auto w-full">
        {showKycBanner && (
          <div className="mx-6 mb-4 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200">
            <div className="font-semibold">KYC Required</div>
            <div className="text-sm">Admin requires seller verification before creating auctions. Please complete your KYC to continue.</div>
            <div className="mt-2">
              <Link to="/seller/kyc" className="inline-block px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white text-sm">Go to KYC</Link>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

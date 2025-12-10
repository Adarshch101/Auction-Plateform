import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminSidebar />
      <main className="pl-64">
        {children}
      </main>
    </>
  );
}

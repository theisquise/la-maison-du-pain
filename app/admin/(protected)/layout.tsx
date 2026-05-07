import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Administration — La Maison du Pain' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

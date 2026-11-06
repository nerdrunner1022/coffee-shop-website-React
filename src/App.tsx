import { Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/admin/admin-layout'
import { ToastProvider } from '@/components/ui/toast'
import { CateringPage } from '@/pages/admin/catering-page'
import { MenuManagementPage } from '@/pages/admin/menu-management-page'
import { NewsletterPage } from '@/pages/admin/newsletter-page'
import { OffersPage } from '@/pages/admin/offers-page'
import { OverviewPage } from '@/pages/admin/overview-page'
import { HomePage } from '@/pages/home-page'
import { MenuPage } from '@/pages/menu-page'

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="catering" element={<CateringPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </ToastProvider>
  )
}

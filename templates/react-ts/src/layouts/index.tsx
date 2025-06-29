import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

export const DashboardLayout = () => {
  return (
    <Layout className="flex h-screen overflow-hidden">
      <Layout className="h-screen overflow-auto">
        <div className="flex-grow p-4 bg-slate-100 relative">
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}

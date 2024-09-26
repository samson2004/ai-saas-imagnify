import Sidebar from '@/components/shared/sidebar'
import MobileNav from '@/components/shared/MobileNav'
const Layout = ({children}) => {
  return (
    <main className="root lg:flex-row">
      <Sidebar />
      <MobileNav />
      <div className="root-container lg:mt-0 lg:max-h-screen lg:py-10">
        <div className="wrapper md:px-10">
        {children}
        </div>
      </div>
      </main>
  );
}

export default Layout
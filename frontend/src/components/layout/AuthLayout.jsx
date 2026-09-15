import Navbar from "./Navbar";
import Footer from "./Footer";

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f4ed] text-[#172033]">
      <Navbar variant="public" />

      <main className="flex flex-1 flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default AuthLayout;
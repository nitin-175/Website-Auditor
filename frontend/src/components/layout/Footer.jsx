import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#e7e5df] bg-white">
      <div className="mx-auto flex min-h-14 max-w-[1440px] items-center justify-between gap-4 px-5 py-4 text-xs text-[#96948d] sm:px-8 lg:px-10">
        <p>© 2026 AuditPro</p>

        <div className="flex items-center gap-3">
          <Link
            to="/privacy"
            className="transition hover:text-[#4f46e5]"
          >
            Privacy
          </Link>

          <span className="text-[#d0cdc4]">•</span>

          <Link
            to="/terms"
            className="transition hover:text-[#4f46e5]"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
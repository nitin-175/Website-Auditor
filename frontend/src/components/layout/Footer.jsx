import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-[#eeeafd] bg-white">
      <div className="mx-auto flex min-h-14 max-w items-center justify-between gap-4 px-5 py-4 text-xs text-gray-400 sm:px-8 lg:px-10">
        <p>© 2026 AuditPro</p>

        <div className="flex items-center gap-3">
          <Link
            to="/privacy"
            className="transition hover:text-[#7c3aed]"
          >
            Privacy
          </Link>

          <span>•</span>

          <Link
            to="/terms"
            className="transition hover:text-[#7c3aed]"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
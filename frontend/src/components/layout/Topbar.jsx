import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-500 sm:block">{user?.email}</span>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}

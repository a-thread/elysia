import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoSun } from "react-icons/go";
import { FaMoon } from "react-icons/fa";
import { FiLogIn, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "@shared/contexts/AuthContext";
import { useModalManager } from "./Modals";
import { IconButton, HamburgerButton } from "./Buttons";
import DropdownButton from "./Buttons/DropdownButton";
import { UserService } from "@shared/services/UserService";
import { useToast } from "./Toast";

function Navbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth();
  const { isModalOpen } = useModalManager();
  const navigate = useNavigate();
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks: { path: string; label: string }[] = [
    { path: "/", label: "Home" },
    { path: "/recipes", label: "Recipes" },
    { path: "/collections", label: "Collections" },
    ...(isAuthenticated
      ? [{ path: "/shopping-list", label: "Shopping List" }]
      : []),
    { path: "/about", label: "About" },
    ...(isAuthenticated ? [{ path: "/settings", label: "Settings" }] : []),
  ];

  // The desktop bar lists content only: the logo already goes home, and Settings and Logout live
  // in the account menu. The drawer (below md) lists everything.
  const desktopLinks = navLinks.filter(
    ({ path }) => path !== "/" && path !== "/settings",
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogin = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate("/sign-in");
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await UserService.signOut();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs dark:bg-gray-900 dark:border-gray-800 ${
        isModalOpen ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={menuRef}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex shrink-0 items-center space-x-2">
          <img
            src={`${import.meta.env.BASE_URL}transparent-logo.png`}
            className="h-8"
            alt="Elysia Logo"
          />
          <span className="self-center text-2xl font-semibold dark:text-leaf-green-100">
            Elysia
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1 lg:gap-4">
          {desktopLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`whitespace-nowrap py-2 px-3 rounded-md transition duration-200 ${
                location.pathname === path
                  ? "dark:text-leaf-green-300 text-leaf-green-500"
                  : "hover:text-leaf-green-300 dark:text-leaf-green-100 dark:hover:text-leaf-green-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex shrink-0 space-x-3">
          <IconButton
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
            icon={
              isDarkMode ? (
                <GoSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              )
            }
          />
          <div className="hidden md:block">
            {isAuthenticated ? (
              <DropdownButton
                triggerLabel="Account"
                icon={
                  <FiUser className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                }
                options={[
                  {
                    label: "Settings",
                    icon: <FiSettings aria-hidden="true" />,
                    onClick: () => navigate("/settings"),
                  },
                  {
                    label: "Log out",
                    icon: <FiLogOut aria-hidden="true" />,
                    onClick: () => handleLogout(),
                    destructive: true,
                    dividerBefore: true,
                  },
                ]}
              />
            ) : (
              <IconButton
                onClick={handleLogin}
                title="Login"
                icon={<FiLogIn className="w-5 h-5 text-leaf-green-500" />}
              />
            )}
          </div>
          <div className="md:hidden flex items-center">
            <HamburgerButton
              toggled={menuOpen}
              onClick={toggleMenu}
              size={22}
              color={isDarkMode ? "#e5e7eb" : "#1f2937"}
            />
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed top-[73px] inset-x-0 bottom-0 z-30 flex justify-end md:hidden">
          <div className="w-3/4 sm:w-[350px] h-full bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`py-2 px-3 block rounded-md transition duration-200 ${
                  location.pathname === path
                    ? "bg-leaf-green-100 text-leaf-green-700 dark:bg-leaf-green-900/40 dark:text-leaf-green-300"
                    : "text-gray-900 dark:text-white hover:bg-leaf-green-50 dark:hover:bg-leaf-green-900/30 hover:text-leaf-green-700 dark:hover:text-leaf-green-300"
                }`}
                onClick={toggleMenu}
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={(e) => {
                (isAuthenticated ? handleLogout : handleLogin)(e);
                setMenuOpen(false);
              }}
              className={`mt-auto flex items-center gap-2 py-2 px-3 rounded-md text-left hover:bg-leaf-green-50 dark:hover:bg-leaf-green-900/30 ${
                isAuthenticated ? "text-red-500" : "text-leaf-green-500"
              }`}
            >
              {isAuthenticated ? (
                <FiLogOut className="w-5 h-5" aria-hidden="true" />
              ) : (
                <FiLogIn className="w-5 h-5" aria-hidden="true" />
              )}
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

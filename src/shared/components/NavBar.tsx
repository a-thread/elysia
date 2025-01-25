import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  Bars4Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "@shared/contexts/AuthContext";
import { AddRecipeModal, useModalManager } from "./Modals";
import { DropdownButton, IconButton } from "./Buttons";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { supabase } from "@shared/services/supabase";
import { DropdownOption } from "./Buttons/DropdownButton";
import AddTagModal from "@shared/components/AddTagModal";

function Navbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth();
  const { isModalOpen, openModal, closeModal } = useModalManager();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = ["/", "/about", "/collections", "/tags"];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const onCloseModal = () => {
    closeModal();
    setMenuOpen(false);
  };

  const handleAddRecipeClick = () => {
    openModal(<AddRecipeModal onClose={onCloseModal} />);
  };

  const handleAddTagClick = () => {
    openModal(<AddTagModal onCancel={onCloseModal} onAddTag={onCloseModal} />);
  };

  const options: DropdownOption[] = [
    { label: "Add Recipe", onClick: handleAddRecipeClick },
    {
      label: "Add Collection",
      onClick: () => navigate("/collections/add-new"),
    },
    { label: "Add Tag", onClick: handleAddTagClick },
  ];

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/sign-in");
  };
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
    navigate("/");
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
      className={`bg-white border-gray-200 dark:bg-gray-900 ${
        isModalOpen ? "opacity-50 pointer-events-none" : ""
      }`}
      ref={menuRef}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://bbosgvxsamxhzjgzxiuz.supabase.co/storage/v1/object/public/elysia_recipe_photo/echlorotica_nature-removebg-preview_1737171542691_7626.png"
            className="h-8"
            alt="Elysia Logo"
          />
          <span className="self-center text-2xl font-semibold dark:text-leaf-green-100">
            Elysia
          </span>
        </Link>
        <div className="hidden md:flex space-x-8">
          {navLinks.map((path) => (
            <Link
              key={path}
              to={path}
              className={`py-2 px-3 rounded-md transition duration-200 ${
                location.pathname === path
                  ? "dark:text-leaf-green-300 text-leaf-green-500"
                  : "hover:text-leaf-green-300 dark:text-leaf-green-100 dark:hover:text-leaf-green-300"
              }`}
            >
              {path === "/"
                ? "Home"
                : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>
        <div className="flex space-x-3">
          {isAuthenticated && (
            <DropdownButton
              options={options}
              icon={
                <PlusIcon className="w-6 h-6 dark:text-leaf-green-300 text-leaf-green-500" />
              }
            />
          )}
          <IconButton
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
            icon={
              isDarkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              )
            }
          />
          <IconButton
            onClick={isAuthenticated ? handleLogout : handleLogin}
            title={isAuthenticated ? "Logout" : "Login"}
            icon={
              isAuthenticated ? (
                <ArrowRightEndOnRectangleIcon className="w-6 h-6 text-red-500" />
              ) : (
                <ArrowLeftEndOnRectangleIcon className="w-6 h-6 text-green-500" />
              )
            }
          />
          <IconButton
            onClick={toggleMenu}
            className="text-gray-500 rounded-lg md:hidden focus:ring-gray-200 dark:text-gray-400"
            title="Open main menu"
            icon={
              <Bars4Icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            }
          />
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="w-3/4 sm:w-[350px] h-full bg-white dark:bg-gray-900 shadow-lg p-6 pt-10 flex flex-col">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" title="Close Menu" />
            </button>
            {navLinks.filter(Boolean).map((path) => (
              <Link
                key={path}
                to={path}
                className="py-2 px-3 block rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={toggleMenu}
              >
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").charAt(0).toUpperCase() +
                    path.slice(2)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

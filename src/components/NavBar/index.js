import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SunIcon, MoonIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../../shared/contexts/DarkModeContext";
import { useAuth } from "../../shared/contexts/AuthContext";
import Button from "../../shared/components/Button";
import { useModalManager } from "../../shared/services/modalManager";
import RecipeInputModal from "./components/AddRecipeModal";
import IconButton from "../../shared/components/IconButton";

function Navbar() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { user } = useAuth();
    const { openModal, closeModal } = useModalManager();

    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const menuRef = useRef();
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    const handleAddRecipeClick = () => {
        openModal(<RecipeInputModal closeModal={closeModal} />)
    };

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [user]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900" ref={menuRef}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-8"
                        alt="Flowbite Logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Elysia
                    </span>
                </a>
                {isAuthenticated && (
                    <>
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                            <Button className="hidden md:block" onClick={handleAddRecipeClick}>Add New Recipe</Button>
                            <IconButton
                                onClick={toggleDarkMode}
                                title="Toggle Dark Mode"
                                icon={isDarkMode ? (
                                    <SunIcon className="w-6 h-6 text-yellow-400" />
                                ) : (
                                    <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                )}
                            />
                            <IconButton
                                onClick={toggleMenu}
                                className="text-gray-500 rounded-lg md:hidden focus:ring-gray-200 dark:text-gray-400"
                                aria-controls="navbar-cta"
                                aria-expanded={menuOpen}
                                title="Open main menu"
                                icon={<Bars4Icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />}
                            />
                        </div>
                        <div
                            className={`items-center justify-between ${menuOpen ? "block" : "hidden"
                                } w-full md:flex md:w-auto md:order-1`}
                            id="navbar-cta"
                        >
                            <div className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                {menuOpen && (
                                    <Button className="w-full" onClick={handleAddRecipeClick}>Add New Recipe</Button>
                                )}

                                <ul className="flex flex-col font-medium md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
                                    <li>
                                        <Link to="/">
                                            <div
                                                className={`block py-2 px-3 md:p-0 rounded ${location.pathname === "/" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}`}
                                            >
                                                Home
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/about">
                                            <div
                                                className={`block py-2 px-3 md:p-0 rounded ${location.pathname === "/about" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}`}
                                            >
                                                About
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/profile">
                                            <div
                                                className={`block py-2 px-3 md:p-0 rounded ${location.pathname === "/profile" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}`}
                                            >
                                                Profile
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/favorites">
                                            <div
                                                className={`block py-2 px-3 md:p-0 rounded ${location.pathname === "/favorites" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"}`}
                                            >
                                                Favorites
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

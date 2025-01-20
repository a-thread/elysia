import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "../../../../shared/components/Buttons";
import { ShareService } from "./shareService";
import { useToast } from "../../../../shared/services/toastManager";

const ShareWithUser = ({ recipeId, setSharedUsers }) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toast = useToast();

  const options = [
    { value: "read", label: "Read-Only" },
    { value: "edit", label: "Can Edit" },
  ];

  const handleListClick = (optionValue) => {
    setPermission(optionValue);
    setIsOpen(false);
  };

  const handleShareWithUser = async () => {
    if (!email) return toast.error("Please enter a valid email.");

    try {
      const user = await ShareService.findUserByEmail(email);
      await ShareService.shareRecipeWithUser(recipeId, user.id, permission);
      toast.success(
        `Recipe shared with ${user.display_name} as ${permission}.`
      );
      setEmail("");
      setSharedUsers(await ShareService.fetchSharedUsers(recipeId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <h3 className="text-sm font-medium mb-2">Share with a User</h3>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="relative z-0 w-full group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 flex justify-between"
          >
            {options.find((opt) => opt.value === permission)?.label}
            <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
              <ul className="py-2 text-gray-700 dark:text-gray-200">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleListClick(opt.value)}
                  >
                    <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button
          btnType="secondary"
          onClick={handleShareWithUser}
          className="w-full"
        >
          Share
        </Button>
      </div>
    </>
  );
};

export default ShareWithUser;

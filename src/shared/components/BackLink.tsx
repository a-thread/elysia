import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
}

const BackLink: React.FC<BackLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-green-700 dark:text-leaf-green-300 transition-opacity hover:opacity-70"
  >
    <FaArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
    {children}
  </Link>
);

export default BackLink;

import React from "react";
import Card from "@shared/components/Card";

interface ConnectionCardProps {
  title: string;
  description: React.ReactNode;
  details: string[];
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}

/** A titled opt-in card with a switch, for connecting Elysia to another app. */
const ConnectionCard: React.FC<ConnectionCardProps> = ({
  title,
  description,
  details,
  enabled,
  disabled,
  onToggle,
}) => (
  <Card className="p-4 md:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-leaf-green-900 dark:text-leaf-green-100">
          {title}
        </h2>
        <p className="mt-2 text-leaf-green-800 dark:text-gray-300">
          {description}
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        disabled={disabled}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-500 disabled:opacity-50 ${
          enabled ? "bg-leaf-green-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  </Card>
);

export default ConnectionCard;

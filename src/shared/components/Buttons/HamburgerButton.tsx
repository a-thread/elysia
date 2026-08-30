import React from "react";

interface HamburgerButtonProps {
  toggled: boolean;
  onClick: () => void;
  className?: string;
  /** Total icon box size in px. */
  size?: number;
  color?: string;
}

const BAR_HEIGHT = 2;

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  toggled,
  onClick,
  className = "",
  size = 24,
  color = "currentColor",
}) => {
  const gap = (size - BAR_HEIGHT * 3) / 2;
  const center = size / 2 - BAR_HEIGHT / 2;

  const barStyle = (index: 0 | 1 | 2): React.CSSProperties => {
    const top = index * (BAR_HEIGHT + gap);
    const base: React.CSSProperties = {
      position: "absolute",
      left: 0,
      top,
      width: size,
      height: BAR_HEIGHT,
      borderRadius: 9999,
      background: color,
      transition: "transform 0.3s ease, opacity 0.3s ease",
    };

    if (index === 1) {
      return { ...base, opacity: toggled ? 0 : 1 };
    }

    if (!toggled) return base;

    const rotate = index === 0 ? 45 : -45;
    return {
      ...base,
      transform: `translateY(${center - top}px) rotate(${rotate}deg)`,
    };
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={toggled ? "Close menu" : "Open menu"}
      aria-expanded={toggled}
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      <span style={barStyle(0)} />
      <span style={barStyle(1)} />
      <span style={barStyle(2)} />
    </button>
  );
};

export default HamburgerButton;

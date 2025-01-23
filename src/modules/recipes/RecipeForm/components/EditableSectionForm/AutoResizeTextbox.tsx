import { useEffect, useRef, ChangeEvent } from "react";

interface AutoResizeTextareaProps {
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  placeholder,
  onChange,
  value,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      className="border rounded-xs px-2 py-1 w-full mr-3 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 resize-none overflow-hidden"
      ref={textareaRef}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default AutoResizeTextarea;

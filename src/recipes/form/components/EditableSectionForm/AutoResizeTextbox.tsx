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
      className="border-0 bg-transparent px-1 py-2 w-full text-sm text-gray-900 dark:text-gray-300 focus:outline-hidden resize-none overflow-hidden"
      ref={textareaRef}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default AutoResizeTextarea;

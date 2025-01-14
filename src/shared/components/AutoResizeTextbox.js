import { useEffect, useRef } from "react";

const AutoResizeTextarea = ({ placeholder, onChange, value }) => {
    const textareaRef = useRef(null);
  
    useEffect(() => {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [value]);
  
    return (
      <textarea
        className="border rounded px-2 py-1 w-full mr-3 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 resize-none overflow-hidden"
        ref={textareaRef}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    );
  };
  
  export default AutoResizeTextarea;
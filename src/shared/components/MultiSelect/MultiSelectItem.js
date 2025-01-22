import React from 'react';
import PropTypes from 'prop-types';

const MultiSelectItem = ({ option, index, selectedIds, handleSelect }) => {
    const baseClasses =
    "flex gap-2 justify-center items-center font-medium rounded-lg px-4 py-2 text-center transition focus:outline-none";
    const classNames = 'text-white bg-leafGreen-700 dark:bg-leafGreen-600 hover:bg-leafGreen-800 dark:hover:bg-leafGreen-800';
    const activeClasses = 'text-leafGreen-600 dark:text-leafGreen-100 border border-leafGreen-600 dark:border-leafGreen-100 hover:bg-leafGreen-100 dark:hover:text-leafGreen-600';
    return (
        <div
            key={index}
            className={`${baseClasses} ${
                selectedIds.includes(option?.id) ? activeClasses : classNames
            }`}
            onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                handleSelect(option);
            }}
        >
            {option.title}
        </div>
    );
};

MultiSelectItem.propTypes = {
    option: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    selectedIds: PropTypes.array.isRequired,
    handleSelect: PropTypes.func.isRequired,
};

export default MultiSelectItem;
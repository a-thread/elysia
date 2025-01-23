import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../Buttons';
import UrlInputForm from './UrlInputForm';
import { BaseModalProps } from '../BaseModal/BaseModalProps';

const AddRecipeModal: React.FC<BaseModalProps> = ({ onClose }) => {
    const [isImporting, setIsImporting] = useState<boolean>(false);

    const navigate = useNavigate();

    const onManualInputClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate('/add-new');
        onClose();
    }

    return (
        <div
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className='p-4'
        >
            <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
            >
                {isImporting ? 'Import Recipe from URL' : 'Add Recipe'}
            </h2>

            {isImporting ? (
                <UrlInputForm onCancel={onClose} />
            ) : (
                <>
                    <p id="modal-description" className="text-gray-600 dark:text-gray-400 mb-6">
                        How would you like to add your recipe?
                    </p>
                    <div className="flex flex-col space-y-4">
                        <Button onClick={() => setIsImporting(true)} aria-label="Import recipe from URL">
                            Import from URL
                        </Button>
                        <Button className="w-full" aria-label="Manually add a recipe" onClick={onManualInputClick}>Manual Input</Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AddRecipeModal;

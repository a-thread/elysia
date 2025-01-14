import React, { useState } from 'react';
import Button from '../../../shared/components/Button';
import { scrapeRecipeForDB } from '../service/scrapeRecipeForDB';

const UrlInputForm = ({ onCancel }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const fetchRecipe = async (recipeUrl) => {
        try {
            const data = await scrapeRecipeForDB(recipeUrl);
    
            console.log(data); // Handle the data (e.g., pass it to the parent or navigate)
            setError(''); // Clear any previous error
        } catch (error) {
            console.error('Failed to fetch recipe:', error);
            setError('Failed to fetch the recipe. Please check the URL and try again.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) {
            setError('URL cannot be empty.');
            return;
        }
        await fetchRecipe(url);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <label htmlFor="url" className="block text-sm text-gray-600 dark:text-gray-400">
                Recipe URL
            </label>
            <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="Enter the recipe URL"
            />
            <div className="flex justify-end space-x-4">
                <Button type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Fetch Recipe</Button>
            </div>
        </form>
    );
};

export default UrlInputForm;

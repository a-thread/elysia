import { jsPDF } from "jspdf";
import { Recipe } from "@shared/models/Recipe";

const marginValue = 15; // Margin for the PDF

/**
 * Generates a PDF for multiple recipes.
 * @param recipes - An array of recipe objects containing details to include in the PDF.
 */
const generateRecipesPDF = async (recipes: Recipe[]) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height - marginValue; // Leave bottom margin

    let yPosition = marginValue;

    /**
     * Checks if a page break is needed and adds a new page if necessary.
     * @param height - The height of the content to be added.
     */
    const checkPageBreak = (height: number) => {
        if (yPosition + height > pageHeight) {
            doc.addPage();
            yPosition = marginValue; // Reset Y position for new page
        }
    };

    for (const recipe of recipes) {
        // Add a new page for each recipe (except the first one)
        if (recipes.indexOf(recipe) > 0) {
            doc.addPage();
            yPosition = marginValue;
        }

        // Add Recipe Image (Centered & Dynamically Scaled)
        if (recipe.img_url) {
            try {
                const imageBase64 = await getBase64FromUrl(recipe.img_url);
                const { width, height } = await getFormattedImageDimensions(recipe.img_url);
                checkPageBreak(height + 10);
                const centerX = (doc.internal.pageSize.width - width) / 2;
                doc.addImage(imageBase64, "JPEG", centerX, yPosition, width, height);
                yPosition += height + 15;
            } catch (error) {
                console.error("Error loading image:", error);
            }
        }

        // Add Recipe Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        
        const wrappedTitle = doc.splitTextToSize(recipe.title, 180);
        doc.text(wrappedTitle, marginValue, yPosition);
        yPosition += wrappedTitle.length * 6 + 8;

        // Add Servings & Time Information
        doc.setFontSize(12);
        const totalTime = recipe.cook_time + (recipe.prep_time || 0);
        doc.text(
            `Servings: ${recipe.servings} | Prep: ${recipe.prep_time} min | Cook: ${recipe.cook_time} min | Total Time: ${totalTime} min`,
            marginValue,
            yPosition
        );
        yPosition += 10;

        // Add Recipe Description
        if (recipe.description?.length) {
            doc.setFont("helvetica", "normal");
            const wrappedDescription = doc.splitTextToSize(recipe.description, 180);
            doc.text(wrappedDescription, marginValue, yPosition);
            yPosition += wrappedDescription.length * 6 + 4;
        }

        // Add Ingredients Section
        checkPageBreak(marginValue);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Ingredients:", marginValue, yPosition);
        yPosition += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        recipe.ingredients.forEach((ingredient) => {
            checkPageBreak(10);
            const wrappedIngredient = doc.splitTextToSize(`- ${ingredient.value}`, 180);
            doc.text(wrappedIngredient, marginValue, yPosition);
            yPosition += wrappedIngredient.length * 6 + 2;
        });
        yPosition += 2;

        // Add Instructions Section
        checkPageBreak(marginValue);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Instructions:", marginValue, yPosition);
        yPosition += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        recipe.steps.forEach((step, index) => {
            checkPageBreak(10);
            const wrappedStep = doc.splitTextToSize(`${index + 1}. ${step.value}`, 180);
            doc.text(wrappedStep, marginValue, yPosition);
            yPosition += wrappedStep.length * 6 + 1;
        });
    }

    // Open PDF in New Tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};

/**
 * Converts an image URL to a Base64 string.
 * @param url - The image URL.
 * @returns A promise that resolves to the Base64 string of the image.
 */
const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Retrieves the dimensions of an image from a URL.
 * @param url - The image URL.
 * @returns A promise that resolves to the width and height of the image.
 */
const getImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
    });
};

/**
 * Formats image dimensions to fit within the PDF constraints.
 * @param url - The image URL.
 * @returns The formatted width and height of the image.
 */
const getFormattedImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
    const { width, height } = await getImageDimensions(url);
    const maxWidth = 180;
    const maxHeight = 90;

    let imgWidth = width;
    let imgHeight = height;

    if (imgWidth > maxWidth) {
        imgHeight *= maxWidth / imgWidth;
        imgWidth = maxWidth;
    }
    if (imgHeight > maxHeight) {
        imgWidth *= maxHeight / imgHeight;
        imgHeight = maxHeight;
    }
    return { width: imgWidth, height: imgHeight };
};

export default generateRecipesPDF;
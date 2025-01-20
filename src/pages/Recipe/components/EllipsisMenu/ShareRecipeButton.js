import { useState } from "react";
import { useToast } from "../../../../shared/services/toastManager";
import Loading from "../../../../shared/components/Loading";
import { supabase } from "../../../../shared/services/supabase";

const ShareRecipeButton = ({ recipeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { displayToast } = useToast();

  const handleShareRecipe = async () => {
    setIsLoading(true);

    try {
      // Step 1: Update the recipe to make it public
      const { error } = await supabase
        .from("recipes")
        .update({ is_public: true })
        .eq("id", recipeId);

      if (error) throw new Error("Failed to make recipe public");

      // Step 2: Generate the public URL
      const publicUrl = `${window.location.origin}/recipes/${recipeId}`;

      // Step 3: Copy the URL to the clipboard
      await navigator.clipboard.writeText(publicUrl);

      // Step 4: Show a success toast notification
      displayToast("Recipe is now public! Link copied to clipboard.");
    } catch (error) {
      console.error(error);
      displayToast("Failed to share recipe. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex gap-2"
      onClick={handleShareRecipe}
      disabled={isLoading}
    >
      {isLoading && <Loading isLarge={false} />}
      Share
    </button>
  );
};

export default ShareRecipeButton;

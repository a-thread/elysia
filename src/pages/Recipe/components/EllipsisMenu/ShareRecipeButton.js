import { useState } from "react";
import { useToast } from "../../../../shared/services/toastManager";
import Loading from "../../../../shared/components/Loading";
import { supabase } from "../../../../shared/services/supabase";

const ShareRecipeButton = ({ recipe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleShareRecipe = async () => {
    setIsLoading(true);
    if (recipe.is_public) {
      await copyLink();
      toast.success("Link copied to clipboard!");
    } else {
      try {
        // Step 1: Update the recipe to make it public
        const { error } = await supabase
          .from("recipes")
          .update({ is_public: true })
          .eq("id", recipe.id);

        if (error) throw new Error("Failed to make recipe public");

        await copyLink();
        toast.success("Recipe is now public! Link copied to clipboard.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to share recipe. Please try again.");
      } finally {
      }
    }
    setIsLoading(false);
  };

  const copyLink = async () => {
    // Step 2: Generate the public URL
    const publicUrl = `${window.location.origin}/elysia/recipe/${recipe.id}`;

    // Step 3: Copy the URL to the clipboard
    await navigator.clipboard.writeText(publicUrl);
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

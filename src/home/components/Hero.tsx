import React from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@shared/models/Recipe";
import { Button } from "@shared/components/Buttons";

const Hero: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 md:h-[420px]">
      {recipe.img_url && (
        <img
          src={recipe.img_url}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute left-6 right-6 sm:left-11 sm:right-11 bottom-9 max-w-xl">
        <div className="text-leaf-green-100 text-xs font-semibold tracking-wider uppercase mb-3">
          Featured Recipe
        </div>
        <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-3">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
            {recipe.description}
          </p>
        )}
        <Button onClick={() => navigate(`/recipes/${recipe.id}`)}>
          View Recipe
        </Button>
      </div>
    </div>
  );
};

export default Hero;

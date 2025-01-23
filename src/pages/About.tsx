import React from "react";
import { AddRecipeModal, useModalManager } from "../shared/components/Modals";
import { Button } from "../shared/components/Buttons";

const About: React.FC = () => {
  const { openModal, closeModal } = useModalManager();

  const onJourneyBegin = (): void => {
    openModal(<AddRecipeModal onClose={closeModal} />);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">About Elysia</h1>

      <div className="flex flex-row justify-center m-4">
        <img
          src="https://bbosgvxsamxhzjgzxiuz.supabase.co/storage/v1/object/public/elysia_recipe_photo/echlorotica_nature-removebg-preview_1737171542691_7626.png"
          className="h-40"
          alt="Elysia Chloratica"
        />
      </div>

      <div className="bg-leafGreen-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-leafGreen-800 mb-3">
          The Slug That Inspired It All
        </h2>
        <p className="text-gray-800">
          Elysia chlorotica is a unique species of sea slug that can perform{" "}
          <strong>photosynthesis</strong>, absorbing energy from the sun like a
          plant. By incorporating chloroplasts from the algae it eats into its
          own cells, it becomes <strong>self-sustaining</strong> and requires
          less food to survive. This incredible ability mirrors our own journey
          - by being mindful of what we consume, we empower ourselves to thrive.
        </p>
      </div>

      <div className="mt-8 p-6 rounded-lg border border-4 border-dashed border-leafGreen-100 dark:leafGreen-200">
        <h2 className="text-xl font-semibold text-leafGreen-800 dark:text-leafGreen-300 mb-3">
          The Vision Behind Elysia
        </h2>
        <p className="text-gray-800 dark:text-white">
          Cooking is more than just a necessity—it's a way to nourish both body
          and mind. Our vision is to build a platform where people can explore
          diverse recipes, develop new skills, and gradually become more
          self-reliant in the kitchen. Just like Elysia chlorotica adapts and
          grows by integrating the best of what it consumes, this app allows
          food lovers to nurture, discover, and evolve their culinary
          environment.
        </p>
      </div>

      <div className="flex flex-col align-items-center mt-10">
        <Button onClick={onJourneyBegin}>Start Your Journey</Button>
      </div>
    </div>
  );
}

export default About;

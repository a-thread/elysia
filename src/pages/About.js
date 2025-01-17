import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Buttons';

function About() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">About Elysia</h1>
      
      <p className="text-lg text-gray-700 text-center mb-8">
        Inspired by the fascinating <strong>Elysia chlorotica</strong>, a sea slug that can harness energy from the sun, 
        <strong> Elysia</strong> was created with the idea that as we continue to explore and experiment with new recipes, 
        we cultivate self-sufficiency and the ability to thrive. Just like Elysia chlorotica adapts and grows by integrating 
        the best of what it consumes, this app allows food lovers to share, discover, and evolve their cooking skills.
      </p>

      <div className="bg-green-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-3">🌿 What is Elysia Chlorotica?</h2>
        <p className="text-gray-800">
          Elysia chlorotica is a unique species of sea slug that can perform **photosynthesis**, absorbing energy from the sun like a plant. 
          By incorporating chloroplasts from the algae it eats into its own cells, it becomes **self-sustaining** and requires less food to survive. 
          This incredible ability mirrors our own journey—by learning new skills and sharing knowledge, we empower ourselves to thrive independently.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-3">💡 The Vision Behind Elysia</h2>
        <p className="text-gray-800">
          Cooking is more than just a necessity—it's a way to nourish both body and mind. Our vision is to build a platform where 
          users can explore diverse recipes, develop new skills, and gradually become more self-reliant in the kitchen. 
          Just like **Elysia chlorotica**, we grow by **absorbing knowledge and adapting**.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-3">🍽 Why Use Elysia?</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          <li>Discover a diverse collection of recipes shared by a thriving community.</li>
          <li>Experiment with new dishes and refine your culinary skills.</li>
          <li>Learn techniques that promote self-sufficiency in the kitchen.</li>
          <li>Share your own recipes and contribute to a growing knowledge base.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-3">🌎 A Community of Growth</h2>
        <p className="text-gray-800">
          Elysia is more than just a recipe-sharing app—it's a place for learning, growing, and thriving. 
          By exchanging ideas and experiences, we support each other in our journey toward self-sufficiency, 
          one meal at a time.
        </p>
      </div>

      <div className="text-center mt-10">
        <Link to="/add-new">
            <Button btnType='primary'>Start Your Journey</Button>
        </Link>
      </div>
    </div>
  );
}

export default About;

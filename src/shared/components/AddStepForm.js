import { useState, useEffect } from "react";

function AddStepForm({ onAddStep, step }) {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step) {
      setInstruction(step.instruction || '');
    }
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddStep({ ...step, instruction });
    setInstruction('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Enter step instruction"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {loading ? (step ? 'Updating...' : 'Adding...') : step ? 'Update Step' : 'Add Step'}
      </button>
    </form>
  );
}

export default AddStepForm;

import { useState } from "react";
import { Dialog } from "@headlessui/react";

const EditQuestionsModal = ({ templateId, initialQuestions, onClose, onEdit }) => {
  const [questions, setQuestions] = useState(initialQuestions.questions);
  const [questionId, setQuestionId] = useState(initialQuestions.questions.length);
  const [questionTypeCounts, setQuestionTypeCounts] = useState(() => {
  const counts = { string: 0, int: 0, checkbox: 0, radio: 0 };
  initialQuestions.questions.forEach((q) => {
    if (counts[q.type] !== undefined) counts[q.type]++;
  });
  return counts;
});


  const addQuestion = () => {
    setQuestions((prevQuestions) => [
    ...prevQuestions,
    { id: questionId, text: "", type: "" },
    ]);
    setQuestionId((prevId) => prevId + 1);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => (question.id === id ? { ...question, [field]: value } : question))
    );
  };


  const removeQuestion = (id) => {
    setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
  };

  const handleSave = () => {
    onEdit({
      templateId,
      questions,
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" />
      <div className="bg-white p-6 rounded-md shadow-lg w-[480px] z-50 overflow-y-auto max-h-[82vh]">
        <h2 className="text-lg font-bold mb-4">Edit Questions</h2>
        <div className="w-full py-4">
            <button
        className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-2 py-1 text-white cursor-pointer mt-3 mb-2 text-md"
        onClick={addQuestion}>
        Add Question
      </button>
      {questions.map((question, index) => (
        <div key={question.id} className="mb-4 py-2">
            <h3 className="font-semibold text-sm mb-1">Question: {index + 1}</h3>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder={`Question ${index + 1}`}
            value={question.text}
            onChange={(e) => updateQuestion(question.id, "text", e.target.value)}/>
          <select
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            value={question.type}
            onChange={(e) => {
    const newType = e.target.value;
    const oldType = question.type;
    if (newType === oldType) return;
    setQuestionTypeCounts((prev) => ({
      ...prev,
      [oldType]: prev[oldType] - 1,
      [newType]: prev[newType] + 1,
    }));
    updateQuestion(question.id, "type", newType);
  }}>
            <option value="Choose a type">Choose a type</option>
            <option disabled={questionTypeCounts.string >= 4} value="string">Text</option>
            <option disabled={questionTypeCounts.int >= 4} value="int">Number</option>
            <option disabled={questionTypeCounts.boolean >= 4} value="boolean">Checkbox</option>
            <option disabled={questionTypeCounts.radio >= 4} value="radio">Radio</option>
          </select>
{question.type === "boolean" && (
     <input
    type="text"
    className="mt-2 w-full p-2 border border-gray-300 rounded"
    placeholder="Enter label for the checkbox"
    value={question.booleanLabel || ""}
    onChange={(e) => updateQuestion(question.id, "booleanLabel", e.target.value)}
  />
  )}
  {question.type === "radio" && (
  <div className="mt-2">
    {question.radioOptions?.map((option, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          className="rounded border px-[5px] py-[5px] border-[#c0d0d9] w-full my-2"
          placeholder="Enter the option"
          value={option}
          onChange={(e) => {
            const updatedOptions = [...question.radioOptions];
            updatedOptions[index] = e.target.value;
            updateQuestion(question.id, "radioOptions", updatedOptions);
          }}
        />
        <button
          className="ml-2 text-red-500 hover:text-red-500 cursor-pointer"
          onClick={() => {
            const filteredOptions = question.radioOptions.filter((_, i) => i !== index);
            updateQuestion(question.id, "radioOptions", filteredOptions);
          }}>
          ✕
        </button>
      </div>
    ))}
    <button
      className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-2 py-1 text-white cursor-pointer mt-3 mb-2 text-md"
      onClick={() =>
        updateQuestion(question.id, "radioOptions", [...(question.radioOptions || []), ""])
      }>
      Add Option
    </button>
  </div>
)}
          <button
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 hover:cursor-pointer"
            onClick={() => removeQuestion(question.id)}>
            Remove question
          </button>
        </div>
      ))}
    </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-4 py-2 text-white cursor-pointer">
            Save
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditQuestionsModal;

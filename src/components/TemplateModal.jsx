import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

const TemplateModal = ({ isOpen, onClose, onCreate, authorName, templateId, isEditing, onEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("Choose a topic");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionId, setQuestionId] = useState(1);
  const [questionTypeCounts, setQuestionTypeCounts] = useState({
  string: 0,
  int: 0,
  checkbox: 0,
  radio: 0,
});

useEffect(() => {
  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/templates/${templateId}`);
      const data = await res.json();
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setTopic(data.topic ?? "Choose a topic");
      setIsPublic(data.isPublic ?? false);
      setImage(data.image ?? null);
      setLabels(data.labels ?? []);
      setQuestions(data.questions ?? []);
      setQuestionId((data.questions?.length ?? 0) + 1);
    } catch (err) {
      console.error("Failed to fetch template:", err);
    }
  };
  if (isEditing && templateId) {
    fetchTemplate();
  }
}, [templateId, isEditing]);


  const handleSubmit = () => {
  const newTemplate = {
    title,
    description,
    topic,
    isPublic,
    image: image || null,
    labels,
    questions,
    authorName,
  };

  if (isEditing) {
    newTemplate.templateId = templateId;
    onEdit(newTemplate);
  } else {
    onCreate(newTemplate);
  }
  onClose();
  setTitle("");
  setDescription("");
  setTopic("Choose a topic");
  setIsPublic(false);
  setImage(null);
  setLabels([]);
  setLabelInput("");
  setQuestions([]);
  setQuestionId(1);
};

  if (!isOpen) return null;
  const handleAddLabel = (e) => {
    if (e.key === "Enter" && labelInput.trim() !== "") {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput("");
    }
  };

  const removeLabel = (index) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: questionId, text: "", type: "" }]);
    setQuestionId(questionId + 1);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => (question.id === id ? { ...question, [field]: value } : question))
    );
  };


  const removeQuestion = (id) => {
    setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== id));
  };


return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-md shadow-lg w-[480px] z-50 overflow-y-auto max-h-[82vh]">
        <h1 className="text-lg font-bold">New Template</h1>
        <label className="block mt-4">Title</label>
        <input
          type="text"
          className="rounded border px-[5px] py-[3px] border-[#c0d0d9] w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="block mt-4">Description</label>
        <textarea
          className="rounded border px-[5px] py-[3px] border-[#c0d0d9] w-full"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label className="block mt-4">Topic</label>
        <select
          className="rounded border px-[5px] py-[3px] border-[#c0d0d9] w-full"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required>
          <option value="Choose a topic" disabled>Choose a topic</option>
          <option value="Education">Education</option>
          <option value="Quiz">Quiz</option>
          <option value="Other">Other</option>
        </select>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            required
          />
          Make the template public?
        </label>
        <label className="block mt-4 mb-1">Upload Image (Optional)</label>
        <input
          type="file"
          className="rounded border p-[5px] border-[#c0d0d9] w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div>
          <label className="block mt-4 mb-1">Labels (Press Enter to add)</label>
          <input
            type="text"
            className="rounded border px-[5px] py-[5px] border-[#c0d0d9] w-full"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={handleAddLabel}
            placeholder="Type a label and press Enter"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {labels.map((label, index) => (
              <span key={index} className="bg-gray-300 px-3 py-1 rounded text-sm flex items-center">
                {label}
                <button
                  className="ml-2 text-red-500 hover:text-red-500 cursor-pointer"
                  onClick={() => removeLabel(index)}>✕</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block mt-4 mb-1">Questions:</label>
          <button
            className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-2 py-1 text-white cursor-pointer mt-3 mb-2 text-md"
            onClick={addQuestion}>
            Add Question
          </button>
          <div className="w-full py-4">
            {questions.map((question, index) => (
              <div key={question.id} className="mb-4 py-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`Question ${index + 1}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                />
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
        </div>
        <div className="flex justify-end items-center mt-4 gap-x-4">
          <button
            className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-4 py-2 text-white cursor-pointer"
            onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Create"}
          </button>
          <button
            className="text-gray-600 hover:underline cursor-pointer"
            onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default TemplateModal;
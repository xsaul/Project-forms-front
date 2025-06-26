import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const TemplateDetails = () => {
  const { id } = useParams();
  const [templateData, setTemplateData] = useState(null);
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const [answers, setAnswers] = useState({});
  const [originalAnswers, setOriginalAnswers] = useState(null);
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate();


const renderInputForType = (question) => {
  switch (question.type) {
    case "string":
      return <input type="text"
      value={answers?.[question.id] || ""}
  onChange={(e) => handleChange(question.id, e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-2 w-96" required />;
    case "int":
      return <input type="number"
      value={answers?.[question.id] || ""}
  onChange={(e) => handleChange(question.id, e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-2 w-96" required/>;
    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <input type="checkbox"
          checked={answers?.[question.id]}
          onChange={(e) => handleChange(question.id, e.target.checked)}
          className="h-5 w-5 text-blue-600" required/>
          <span>{question.booleanLabel}</span>
        </div>
      );
    case "radio":
      return (
        <div className="space-x-4">
          {question.radioOptions?.map((option, index) => (
            <label key={index} className="space-x-2">
            <input type="radio" value={option} checked={answers?.[question.id] === option} onChange={() => handleChange(question.id,option)} required/>
            <span>{option}</span>
            </label>
          ))}
        </div>
      );
  }
};

const handleChange = (questionId, value) => {
  setAnswers((prev) => ({
    ...prev,
    [questionId]: value,
  }));
};

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/templates/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTemplateData(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

useEffect(() => {
  if (!id) return;
  fetchTemplate();
}, [id]);

useEffect(() => {
  if (isEditing || !templateData) return;
  const initialState = {};
  templateData.questions.forEach((q) => {
    if (q.type === "boolean") {
      initialState[q.id] = false;
    }
  });
  setAnswers(initialState);
}, [templateData, isEditing]);


useEffect(() => {
  const fetchUserAnswers = async () => {
    if (!userId || !id) return;
    const res = await fetch(`http://localhost:5000/userResponse?userId=${userId}&templateId=${id}`);
    if (res.ok) {
      const data = await res.json();
      setAnswers(data)
      setOriginalAnswers(data);
      setIsEditing(true)
    }
  };
  fetchUserAnswers();
}, [userId, id]);

const getChangedAnswers = () => {
  const changedAnswers = {};
  for (const key in answers) {
    if (answers[key] !== originalAnswers[key]) {
      changedAnswers[key] = answers[key];
    }
  }
  return changedAnswers;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  let endpoint = "/registerAnswers";
  let payload = {
    userId: userId,
    templateId: id,
    answers: answers,
  };
  if (isEditing) {
    const changedAnswers = getChangedAnswers();
    if (Object.keys(changedAnswers).length === 0) {
      alert("No changes to save");
      return;
    }
    endpoint = "/editAnswers";
    payload.answers = changedAnswers;
  }
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert(
        isEditing
          ? "Your answers were edited correctly"
          : "Your answers were submitted correctly"
      );
      setTimeout(() => navigate("/templates"), 200);
    } else {
      alert("Something went wrong!");
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert("An error occurred while connecting to the server.");
  }
};

  return (
    <>
    <Navbar userName={userName}/>
     <div className="bg-[#ecf1f4] min-h-screen">
    <div className="pt-25 pb-5 px-[250px]">
  <div className="flex flex-wrap items-center justify-between mb-4">
    <h1 className="text-3xl font-bold">{templateData?.title}</h1>
    <div className="flex items-center space-x-2">
      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{templateData?.topic}</span>
      {templateData?.labels.map((label, index) => (
        <span
          key={index}
          className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
          {label}
        </span>
      ))}
    </div>
  </div>
  <p className="text-sm text-gray-500 mb-4">Created by {templateData?.authorName}</p>
  <p className="text-lg text-gray-700 mb-6">{templateData?.description}</p>
<form onSubmit={handleSubmit}>
  <div className="space-y-6">
    {templateData?.questions.map((question, index) => (
      <div key={question.id}>
        <label className="block font-medium text-gray-800 mb-1">
          {index + 1}. {question.text}
        </label>
        {renderInputForType(question)}
      </div>
    ))}
  </div>
  <label className="block text-sm text-gray-600 mt-8 mb-2">Add a comment (optional)</label>
  <textarea
    rows={4}
    className="w-2/3 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
    placeholder="Write your comment here..."
    value={answers?.comment || ""}
  onChange={(e) => setAnswers((prev) => ({
    ...prev,
    comment: e.target.value
  }))}></textarea>
    <div className="mt-8">
        <button className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-4 py-2 text-white cursor-pointer">Submit answers</button>
</div>
</form>
</div>
</div>
    </>
  );
};

export default TemplateDetails;
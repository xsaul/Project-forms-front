import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TemplateCard from "./TemplateCard";
import TemplateModal from "./TemplateModal";
import EditQuestionsModal from "./EditQuestionsModal";

const Dashboard = ({userName}) => {

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [isEditQuestionsModalOpen, setIsEditQuestionsModalOpen] = useState(false);

  const handleCreate = async (newTemplate) => {
    const {image, ...templateData} = newTemplate;
  const response = await fetch("https://project-forms-back.onrender.com/registerTemplate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(templateData),
  });
   if (response.ok) {
     setTemplates([...templates, newTemplate]);
  }
  };

  const handleEditTemplate = async ({ templateId, questions }) => {
  try {
    const response = await fetch("https://project-forms-back.onrender.com/editTemplateQuestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, questions }),
    });

    if (response.ok) {
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === templateId ? { ...template, questions } : template
        )
      );
    }
  } catch (err) {
    console.error("Error updating template:", err);
  }
};


useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("https://project-forms-back.onrender.com/getTemplates");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleOpenEditQuestionsModal = (templateId) => {
  fetch(`https://project-forms-back.onrender.com/templates/${templateId}`)
    .then((res) => res.json())
    .then((data) => {
      setSelectedTemplateData(data); 
      setIsEditQuestionsModalOpen(true); 
    })
    .catch((err) => {
      console.error("Failed to fetch template:", err);
    });
};
  return (
    <div className="bg-[#ecf1f4] h-screen">
    <div className="pt-22 px-6">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-[#3e2e2f]">Templates dashboard</h1>
        {userName !== "Guest" && (
        <button className="bg-[#3e2e2f] hover:bg-[#655859] flex items-center gap-2 rounded px-4 py-2 text-white cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <FaPlus />
          <span>Create</span>
        </button>
        )}
        <TemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreate} authorName={userName}/>
      </div>
     <div className="mt-6 grid grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-y-4 gap-x-2">
  {templates.map((template, index) => (
    <TemplateCard key={index} template={template} userName={userName} onEditClick={handleOpenEditQuestionsModal}/>
  ))}
  {isEditQuestionsModalOpen && selectedTemplateData && (
  <EditQuestionsModal
    templateId={selectedTemplateData.id}
    initialQuestions={selectedTemplateData}
    onClose={() => setIsEditQuestionsModalOpen(false)}
    onEdit={handleEditTemplate}
  />
)}
</div>
</div>
    </div>
  );
};

export default Dashboard;
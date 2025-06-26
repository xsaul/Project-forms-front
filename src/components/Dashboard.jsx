import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TemplateCard from "./TemplateCard";
import TemplateModal from "./TemplateModal";

const Dashboard = ({userName}) => {

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

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
    <TemplateCard key={index} template={template} />
  ))}
</div>
</div>
    </div>
  );
};

export default Dashboard;
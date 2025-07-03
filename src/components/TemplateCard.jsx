import { Link } from "react-router-dom";

const TemplateCard = ({ template, userName, onEditClick }) => {
const colors = [
   "bg-blue-200",
   "bg-orange-200",
   "bg-emerald-200",
   "bg-amber-200", 
   "bg-purple-200",
   "bg-pink-200",
];

function getColorFromId(id) {
  return colors[id % colors.length];
}

const isAuthor = userName === template.authorName;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
      <div className="flex items-center gap-3">
        <p className={`w-12 h-12 flex items-center justify-center ${getColorFromId(template.id)} text-black text-lg font-semibold rounded-md`}>
          {template.authorName.slice(0, 2).toUpperCase()}
        </p>
        <Link to={`/templates/${template.id}`} className="text-lg font-bold text-gray-800 hover:underline">{template.title}</Link>
      </div>
      <div className="mt-2 flex gap-2 text-sm">
        <span className="bg-gray-200 px-2 py-1 rounded">{template.topic}</span>
        {template.isPublic == true && (
          <span className="bg-green-200 px-2 py-1 rounded">Public</span>
        )}
      </div>
      <p className="mt-3 text-gray-600 text-sm">{template.description}</p>
      <div className="flex items-end justify-between">
      <p className="mt-2 text-gray-500 text-xs">By {template.authorName}</p>
      {isAuthor && (
    <button clasName="text-[13px] font-bold text-gray-800 hover:underline" onClick={() => onEditClick(template)}>Edit Questions</button>
  )}
      </div>
    </div>
  );
};

export default TemplateCard;
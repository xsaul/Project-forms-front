import { FaSearch, FaChevronDown } from "react-icons/fa";

const Navbar = ({userName}) => {
  const userType = localStorage.getItem("userType");
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#3e2e2f]">Saul Forms</h1>
      <div className="flex items-center gap-4">
        <div className="relative mr-6">
          <input
            type="text"
            placeholder="Search by topic or by author"
            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-80"/>
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <button className="text-[#3e2e2f] cursor-pointer flex items-center gap-2">
          <span className="text-lg">{userName} <span className="text-base">{userType == "Admin" && "(Admin)"}</span></span>
          <FaChevronDown />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
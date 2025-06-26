import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
const Templates = () => {
   const userName = localStorage.getItem("userName");
  return (
    <>
    <Navbar userName={userName} />
    <Dashboard userName={userName}/>
    </>
  );
};

export default Templates;

import {useState} from "react";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [isSigningUp, setIsSigningUp] = useState(false);
      const navigate = useNavigate();
    
  return (
     <div className="flex justify-center overflow-hidden bg-[#c0d0d9]">
      <div className="flex items-center justify-center w-[730px] h-[100vh] flex-col" >
        <div className="max-w-[500px] w-full bg-white shadow-md p-4 rounded-lg">
  <h1 className="text-[#3e2e2f] text-center text-2xl font-bold">Saul Forms</h1>
  <h2 className="text-center text-sm text-gray-600">Share your quizzes and tests!</h2>
  <h3 className="text-center font-bold text-lg mb-3">
    {isSigningUp ? "Create an Account" : "Sign In to the app"}
  </h3>
  {isSigningUp ? <SignUpForm /> : <SignInForm />}
  <div className="mt-1 text-center">
    <button
      className="text-blue-500 hover:underline cursor-pointer"
      onClick={() => setIsSigningUp(!isSigningUp)}>
      {isSigningUp
        ? "Already have an account? Sign in"
        : "Don't have an account? Sign up"}
    </button>
    {!isSigningUp && (
    <button
      className="mt-2 ml-[35px] text-md text-gray-500 hover:underline cursor-pointer"
      onClick={() => {
    localStorage.clear();
    localStorage.setItem("userName", "Guest");
    navigate("/templates"); 
  }}>
      Or continue as a guest
    </button>
  )}
  </div>
</div>
      </div>
    </div>
  )
}

export default HomePage
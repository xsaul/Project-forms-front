import {useState} from "react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
      return;
    }
  const response = await fetch("https://project-forms-back.onrender.com/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
    const data = await response.json();
   if (response.ok && data.userId) {
    localStorage.clear();
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userType", data.userType);
      navigate("/templates");}};
  return (
    <form onSubmit={handleSignUp}>
        <div className="mb-2 flex flex-col">
      <label className="mb-2">Name</label>
      <input type="text" className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={name}
        onChange={(e) => setName(e.target.value)} placeholder="Your Name" required/>
    </div>
      <div className="mb-2 flex flex-col">
        <label className="mb-2">E-mail</label>
        <input type="email" className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="test@example.com" required/>
      </div>
      <div className="mb-2 flex flex-col">
        <label className="mb-2">Password</label>
        <input type="password" className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="********" required/>
      </div>
      <div className="mb-2 flex flex-col">
        <label className="mb-2">Confirm Password</label>
        <input type="password" className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" required/>
      </div>
      <div className="flex justify-center my-3">
      <button type="submit" className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-4 py-2 text-white cursor-pointer">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUpForm;
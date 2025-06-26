import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("https://project-forms-back.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok && data.userId) {
      localStorage.clear();
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userType", data.userType);
      navigate("/templates");}};

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-3 flex flex-col">
          <label className="mb-2">E-mail</label>
          <input type="email" className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="test@example.com"/>
        </div>
        <div className="mb-3 flex flex-col">
          <label className="mb-2">Password</label>
          <input type={showPassword ? "text" : "password"} className="rounded border px-[5px] py-[3px] border-[#c0d0d9]" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="********"/>
          <span 
            className="absolute right-[460px] top-[353px] cursor-pointer text-[#c0d0d9]" 
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="mt-2 flex justify-end">
        <button 
  type="button"
  className="text-blue-500 hover:underline cursor-pointer text-sm" 
  onClick={(e) => {
    e.preventDefault();
    setShowModal(true);
  }}>
  Forgot password?
</button>
</div>
        <div className="flex justify-center my-3">
        <button type="submit" className="bg-[#3e2e2f] hover:bg-[#655859] flex justify-center rounded px-4 py-2 text-white cursor-pointer">Sign In</button>
        </div>
      </form>
      {showModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
     zIndex: 999
  }}>
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      width: "450px",
      textAlign: "center"
    }}>
      <h2>Password Reset</h2>
      <p>Enter your email to receive a password reset link.</p>
      <input type="email" className="rounded border px-[5px] py-[1px] border-[#c0d0d9] w-[75%] my-3" placeholder="Enter your email"/>
      <div className="mt-3" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
  <button className="bg-[#3e2e2f] rounded px-4 py-2 text-white cursor-pointer">Send Reset Link</button>
  <button className="cursor-pointer" onClick={() => setShowModal(false)}>Close</button>
</div>
    </div>
  </div>
)}
    </>
  );};
export default SignInForm;
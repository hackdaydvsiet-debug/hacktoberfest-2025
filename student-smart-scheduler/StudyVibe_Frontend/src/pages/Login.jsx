import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import Footer from "../components/Reusable/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex flex-1">
      <div className="flex flex-col z-2 items-center justify-center min-w-96 mx-auto">
        <div className="max-w-lg p-6 rounded-xl shadow-lg border-t-sky-100 bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300 border-t-2  bg-sly-blue-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20">
          <h1 className="text-3xl  font-semibold text-center text-gray-500">
            Login
            <span className="text-blue-500"> Study Planner</span>
          </h1>

          <form onSubmit={handleSubmit}>
            <div>
            <label className="label mt-3 flex pl-2">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter email"
              className="w-full input input-bordered h-10 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label flex pl-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to="/signup"
            className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block">
            {"Don't"} have an account?
          </Link>

          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner "></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>

    
     </div>
    <Footer />

    </div>

  );
};
export default Login;

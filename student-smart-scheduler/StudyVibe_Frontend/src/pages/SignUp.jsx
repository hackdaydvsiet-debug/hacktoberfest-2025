import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../hooks/useSignup";
import Footer from "../components/Reusable/Footer";

const Signup = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="flex flex-col  items-center justify-center min-w-96 mx-auto">
          <div className="w-full p-6 rounded-xl shadow-lg border-t-2   bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300 bg-sky-blue-500 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-0">
            <h1 className="text-3xl font-semibold text-center text-gray-500">
              Sign Up <span className="text-blue-500"> Study Planner</span>
            </h1>

            <form onSubmit={handleSubmit}>
              <div>
                <label className="label mt-3 flex pl-2">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full input input-bordered h-10"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label mt-3 flex pl-2">
                  <span className="text-base label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full input input-bordered h-10"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="label mt-3 flex pl-2">
                  <span className="text-base label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full input input-bordered h-10"
                  value={inputs.confirmPassword}
                  onChange={(e) =>
                    setInputs({ ...inputs, confirmPassword: e.target.value })
                  }
                />
              </div>

              <Link
                to={"/login"}
                className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                href="#">
                Already have an account?
              </Link>

              <div>
                <button
                  className="btn btn-block btn-sm mt-2 border border-slate-700"
                  disabled={loading}>
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Sign Up"
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
export default Signup;

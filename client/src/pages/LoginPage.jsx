import { useState } from "react";
import { Eye, EyeOff, Smartphone, Zap, Shield, ArrowRight } from "lucide-react";
import { auth } from "../configs/firebase";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSwitch(e) {
    e.preventDefault();
    try {
      navigate("/auth/register");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userLoggedIn = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userLoggedIn);
      navigate("/");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your email and password.",
        background: "rgba(17, 24, 39, 0.9)",
        color: "#fff",
        confirmButtonColor: "#6366f1",
        customClass: {
          popup: "rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10",
          title: "text-lg font-bold",
          htmlContainer: "text-sm text-gray-300"
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TechVault
              </h1>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Next-Gen
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Gadgets
              </span>
              <br />
              Await
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Discover cutting-edge technology and premium gadgets. From
              smartphones to smart homes, we've got your tech needs covered.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Smartphone className="w-5 h-5 text-blue-400 mr-3" />
                <span>Latest smartphone releases</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Shield className="w-5 h-5 text-purple-400 mr-3" />
                <span>Secure & authenticated purchases</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Zap className="w-5 h-5 text-cyan-400 mr-3" />
                <span>Lightning-fast delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Sumsang Tech
              </h1>
            </div>
            <form onSubmit={handleLogin}>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Welcome Back
                  </h3>
                  <p className="text-gray-400">
                    Sign in to your account to continue shopping
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-sm text-gray-300">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    ></a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center group cursor-pointer"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                  <div className="text-center mt-8">
                    <p className="text-gray-400">
                      Don't have an account?{" "}
                      <a
                        onClick={handleSwitch}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                      >
                        Sign up here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

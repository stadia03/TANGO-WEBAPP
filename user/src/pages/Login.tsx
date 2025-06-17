import axios from 'axios';
import { useState,useEffect } from 'react';
import { useUserStore } from '../store';
import { useLocation } from "react-router-dom";
export default function Login() {
  const [loading, setLoading] = useState(false);
const location = useLocation();

  useEffect(() => {
    if (location.state?.expired) {
      alert("Your session has expired. Please log in again.");
    }
  }, [location]);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/userLogin`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.currentUser.name); // Store name
        localStorage.setItem('userDesignation', response.data.currentUser.designation);
        useUserStore.getState().setName(response.data.currentUser.name);
        useUserStore.getState().setDesignation(response.data.currentUser.designation);
        useUserStore.getState().setAuth(true);
      } else {
        alert(response.data.message);
        console.log('Failed to get token');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error('Error logging in', error);
        alert('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/assets/login-bg.jpg')] bg-cover bg-center px-4">
      <div className="bg-black/30 backdrop-blur-md border border-slate-600 rounded-lg p-8 sm:p-10 w-full max-w-fit">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl text-white font-semibold">
            Welcome to <span className="text-blue-500 font-bold">Tango Reports</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            id="username"
            type="text"
            placeholder="Username"
            required
            className="border border-white rounded-md w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            className="border border-white rounded-md w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />

          <div className="h-14 flex items-center justify-center mt-2">
            {loading ? (
              <img
                src="/assets/loading.svg"
                alt="Loading..."
                className="w-10 h-10"
              />
            ) : (
              <button
                type="submit"
                className="w-full border border-white rounded-md px-6 py-2 text-white hover:bg-gray-700 focus:outline-none"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

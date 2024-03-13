import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen " style={{ backgroundImage: "url('../Images/image2.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="text-center">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap');
          `}
        </style>
        <h1 className="text-6xl font-bold text-red-800 mb-8" style={{ fontFamily: 'Merriweather, sans-serif' }}>
          Welcome to NovaChat
        </h1>
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <ul className="flex space-x-4">
            <li className="-mb-px">
              <button
                className="bg-blue-500 text-white inline-block py-2 px-4 font-semibold rounded-t cursor-pointer hover:bg-blue-600"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </li>
            <li className="-mb-px">
              <button
                className="bg-green-500 text-white inline-block py-2 px-4 font-semibold rounded-t cursor-pointer hover:bg-green-600"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
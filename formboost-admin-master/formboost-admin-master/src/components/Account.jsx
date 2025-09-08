import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaTwitter, FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BACKEND_URL} from "../../src/utils/constants"

const Account = () => {
  const [userId, setUserId] = useState(null); // Store user ID here
  const [fname, setFname] = useState("");
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleChangePasswordVisibility = () =>
    setShowChangePassword(!showChangePassword);

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `${BACKEND_URL}/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        if (result.success) {
          const userData = result.data;
          setUserId(userData.id); // Save the ID
          setFname(userData.name);
          setEmail(userData.email);
          setPassword(""); // Clear password for security reasons
          // Add any other fields as needed
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle form submission to update admin details
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${BACKEND_URL}/admin/${userId}`, // Use the user ID here
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: fname,
            email: email,
            password: password !== "" ? password : undefined, // Only send password if it's changed
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Details updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Failed to update details. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="text-black mt-20 mx-auto px-4 max-w-7xl">
      <h1 className="font-bold text-2xl mb-8 tracking-widest text-center">
        PROFILE
      </h1>

      <div className="flex flex-col md:flex-row gap-8 md:gap-[3vw]">
        <div className="left bg-white rounded-md h-auto md:h-[44vh] w-full md:w-[20vw] flex justify-center">
          <div className="image mt-2 text-center">
            <img
              className="h-32 object-cover w-32 mx-auto"
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              alt="Profile"
            />
            <h1 className="text-2xl font-bold mt-0">{fname}</h1>
            <h2 className="text-md font-semibold text-blue-700">{role}</h2>
            <div className="icons flex justify-center gap-4 mt-2">
              <FaTwitter className="h-10 w-6" />
              <FaFacebook className="h-10 w-6" />
              <FaInstagramSquare className="h-10 w-6" />
              <FaLinkedin className="h-10 w-6" />
            </div>
          </div>
        </div>

        <div className="right rounded-md bg-white p-6 w-full md:w-[50vw]">
          <h1 className="text-xl font-semibold text-center mb-4 tracking-widest">
            PROFILE
          </h1>
          <p className="h-[0.4px] bg-[#B8B8B8] mb-6"></p>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
              <h2 className="font-semibold text-[#012970] w-full md:w-[20%]">
                Full name
              </h2>
              <input
                className="border outline-none border-[#B8B8B8] rounded-sm w-full h-10 p-4 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
              <h2 className="font-semibold text-[#012970] w-full md:w-[20%]">
                Email
              </h2>
              <input
                className="border outline-none border-[#B8B8B8] rounded-sm w-full h-10 p-4 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* 
            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
              <h2 className="font-semibold text-[#012970] w-full md:w-[20%]">
                Password
              </h2>
              <div className="relative w-full">
                <input
                  className="border outline-none border-[#B8B8B8] rounded-sm w-full h-10 p-4 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <lord-icon
                      src="https://cdn.lordicon.com/itxapyjk.json"
                      trigger="hover"
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <lord-icon
                      src="https://cdn.lordicon.com/ccrgnftl.json"
                      trigger="hover"
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </button>
              </div>
            </div> */}

            <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
              <h2 className="font-semibold text-[#012970] w-full md:w-[20%]">
                Change Password
              </h2>
              <div className="relative w-full">
                <input
                  className="border outline-none border-[#B8B8B8] rounded-sm w-full h-10 p-4 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  type={showChangePassword ? "text" : "password"}
                  value={changePassword}
                  onChange={(e) => setChangePassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-2 flex items-center"
                  onClick={toggleChangePasswordVisibility}
                >
                  {showChangePassword ? (
                    <lord-icon
                      src="https://cdn.lordicon.com/itxapyjk.json"
                      trigger="hover"
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <lord-icon
                      src="https://cdn.lordicon.com/ccrgnftl.json"
                      trigger="hover"
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                className="bg-[#1971FB] text-white py-2 px-8 rounded-md transition-colors hover:bg-[#0e5ec6]"
              >
                Save Changes
              </button>
              {/* <button
                type="reset"
                className="bg-red-500 text-white py-2 px-8 rounded-md transition-colors hover:bg-red-700"
              >
                Reset
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Account;

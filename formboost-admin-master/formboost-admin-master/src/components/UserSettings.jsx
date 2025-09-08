import "react-toastify/dist/ReactToastify.css";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookSquare,
  FaLinkedin,
} from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("Account");

  const tabs = [
    { id: "Account", title: "Account" },
    { id: "Edit", title: "Edit" },
    { id: "Settings", title: "Settings" },
    { id: "Change Password", title: "Change Password" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Account":
        return (
          <>
            <h1 className="font-semibold text-2xl mt-6 ms-10">About</h1>
            <p className="mt-6 ms-10">
              <i>
                Sunt est soluta temporibus accusantium neque nam maiores cumque
                temporibus. Tempora libero non est unde veniam est qui dolor. Ut
                sunt iure rerum quae quisquam autem eveniet perspiciatis odit.
                Fuga sequi sed ea saepe at under.
              </i>
            </p>
            <h1 className="font-semibold text-2xl mt-6 ms-10">
              Profile Details
            </h1>
            <div className="user-info flex font-sans">
              <div className="fieldname">
                <ul className="flex flex-col gap-4 text-[18px] mt-6 ms-10">
                  <li>Full Name</li>
                  <li>Company</li>
                  <li>Job</li>
                  <li>Country</li>
                  <li>Address</li>
                  <li>Phone</li>
                  <li>Email</li>
                </ul>
              </div>
              <div className="fieldname">
                <ul className="flex flex-col gap-4 text-[18px] mt-6 ms-10">
                  <li>Jhon Doe</li>
                  <li>Lueilwitz, Wisoky and Leuschke</li>
                  <li>Web Designer</li>
                  <li>USA</li>
                  <li>A108 Adam Street, New York, NY 535022</li>
                  <li>(436) 486-3538 x29071</li>
                  <li>k.anderson@example.com</li>
                </ul>
              </div>
            </div>
          </>
        );
      //  <img
      //    className="h-32 w-32 rounded-sm object-cover"
      //    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      //    alt=""
      //  />;
      case "Edit":
        return (
          <div className="mt-6 ms-10 flex gap-10">
            <div className="porfile-columns flex flex-col gap-20">
              <ul className="flex flex-col gap-5">
                <li className="font-semibold mt-2 text-md">Profile Image</li>
                <li className="font-semibold mt-[130px] text-md">Full Name</li>
                <li className="font-semibold mt-4 text-md">About</li>
                <li className="font-semibold mt-4 text-md">Country</li>
                <li className="font-semibold mt-4 text-md">Address</li>
                <li className="font-semibold mt-4 text-md">Phone</li>
                <li className="font-semibold mt-4 text-md">Email</li>
              </ul>
            </div>

            <div className="porfile-columns flex flex-col gap-20">
              <ul className="flex flex-col gap-5">
                <li className="font-semibold  text-md">
                  <img
                    className="h-28 w-32 rounded-sm object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                  />
                  <div className="profile-buttons flex ">
                    <IoMdCloudUpload className="w-8 h-8 cursor-pointer text-blue-600" />
                    <MdDeleteForever className="w-8 h-8 cursor-pointer text-red-600" />
                  </div>
                </li>

                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center  w-[30vw] hover:shadow-2xl"
                    placeholder="Jhon Doe"
                  />
                </li>
                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center w-[30vw] hover:shadow-2xl"
                    placeholder="Hey,I am a Web Designer"
                  />
                </li>
                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center w-[30vw] hover:shadow-2xl"
                    placeholder="USA"
                  />
                </li>
                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center w-[30vw] hover:shadow-2xl"
                    placeholder="A108 Adam Street, New York, NY 535022"
                  />
                </li>
                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center w-[30vw] hover:shadow-2xl"
                    placeholder="(436) 486-3538 x29071"
                  />
                </li>
                <li className="font-semibold mt-4 text-md">
                  <input
                    type="text"
                    className="outline-none text-center w-[30vw] hover:shadow-2xl"
                    placeholder="JhonDoe@example.com"
                  />
                </li>
                <li className="m-auto">
                  <button className="p-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white text-sm ">
                    Save Changes
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      case "Settings":
        return (
          <div className="mt-6 ms-10  ">
            <div className="flex gap-20">
              <h1 className="font-semibold">Email</h1>
              <input type="checkbox" />
              <p className="font-sans">Changes made to your account</p>
            </div>
            <div className="flex mt-10 gap-[37px]">
              <h1>Notifications</h1>
              <input type="checkbox" />
              <p className="font-sans">
                Information on new products and services
              </p>
            </div>
            <div className="flex ms-[125px] mt-10 gap-8">
              <input type="checkbox" />
              <p className="font-sans">Marketing and promo offers</p>
            </div>
            <button className="p-2 bg-blue-600 ms-52 mt-10 rounded-md  hover:bg-blue-700 text-white text-sm ">
              Save Changes
            </button>
          </div>
        );
      case "Change Password":
        return (
          <div className="mt-6 ms-10 ">
            <div className="flex gap-20">
              <h1>
                Current <br /> Password
              </h1>
              <input type="text" placeholder="" className="w-[30vw] h-[6vh]" />
            </div>

            <div className="flex gap-20 mt-10">
              <h1>
                New <br /> Password
              </h1>
              <input type="text" placeholder="" className="w-[30vw] h-[6vh]" />
            </div>

            <div className="flex gap-[45px] mt-10">
              <h1>
                Re-Enter <br /> New Password
              </h1>
              <input type="text" placeholder="" className="w-[30vw] h-[6vh]" />
            </div>
            <button className="p-2 bg-blue-600 ms-52 mt-10 rounded-md  hover:bg-blue-700 text-white text-sm ">
              Change Password
            </button>
          </div>
        );

      default:
        return "Account";
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mt-14 relative">Settings</h1>
      <div>
        <div className="mt-10 flex gap-10 ">
          <div className="flex flex-col w-[300px] h-[300px] bg-slate-200 shadow-2xl">
            <img
              id="avatarButton"
              type="button"
              className="w-32 h-32 m-auto rounded-full cursor-pointer object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User dropdown"
            />
            <h2 className="ms-16 font-semibold text-4xl">Jhon Doe</h2>
            <h3 className="ms-20 mt-3 font-serif text-xl">Web Designer</h3>
            <div className="social-links mt-3 flex gap-2 m-auto">
              <a href="#" className="twitter">
                <FaTwitter />
              </a>
              <a href="#" className="facebook">
                <FaInstagram />
              </a>
              <a href="#" className="instagram">
                <FaFacebookSquare />
              </a>
              <a href="#" className="linkedin">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="info bg-slate-200 mb-[50px] h-[120vh] w-[55vw] shadow-2xl">
            <div className="flex ps-6">
              <div className="mb-4 border-b flex flex-col">
                <ul
                  className="flex -mb-px text-sm font-medium text-center"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li key={tab.id} className="me-2" role="presentation">
                      <button
                        className={`inline-block p-4 border-b-2 rounded-t-lg ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-500 font-bold"
                            : "hover:text-blue-500"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={activeTab === tab.id}
                      >
                        {tab.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>{renderContent()}</div>
          </div>
        </div>

        <div className="h-[1px] bg-blue-300 seperator m-2"></div>

        <footer
          id="footer"
          className="footer flex flex-col justify-center items-center"
        >
          <div className="copyright">
            © Copyright
            <strong>
              <span> Formboost</span>
            </strong>
            . All Rights Reserved
          </div>
          <div className="crEdits">
            Designed by{" "}
            <a href="https://bootstrapmade.com/">
              <strong>Rachana Webtech</strong>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserSettings;

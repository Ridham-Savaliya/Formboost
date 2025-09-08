
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";


const AccountSettings = () => {
  return (
    <div>
      <h1 className="font-bold ms-6 text-2xl mt-20 tracking-widest">
        PROFILE SETTINGS
      </h1>
      <div className="mt-10 flex">
        <div className="left bg-white ms-8  rounded-md h-[44vh] w-[20vw] flex justify-center">
          <div className="image mt-2">
            <img
              className="h-32 object-cover w-32"
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              alt=""
            />
            <h1 className="text-2xl font-bold ms-2 ">Jhon Doe</h1>
            <h2 className="text-md ms-8 font-semibold text-blue-700">Admin</h2>
            <div className="icons flex ">
              <ul className="flex justify-center gap-4 mt-2  ">
                <li>
                  <FaTwitter className="h-10 w-6" />
                </li>
                <li>
                  <FaFacebook className="h-10 w-6" />
                </li>
                <li>
                  <FaInstagramSquare className="h-10 w-6" />
                </li>
                <li>
                  <FaLinkedin className="h-10 w-6" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="right rounded-md bg-white h-[80vh] w-[60vw] ms-[2vw] flex flex-col">
          <h1 className="text-xl font-semibold text-center m-2 tracking-widest">
            PROFILE SETTINGS
          </h1>

          <p className="h-[0.4px] m-2 bg-[#B8B8B8]"></p>

          <div className="settings">
            <form action="" className="flex flex-col gap-10 justify-center">
              <div className="flex gap-10">
                <label className="ms-20" htmlFor="email">
                  Email
                </label>
                <input type="checkbox" name="email" id="" />
                <label htmlFor="">Changes made to your account</label>
              </div>
              <div className="flex gap-7">
                <label className="ms-10" htmlFor="Notifications">
                  Notifications
                </label>
                <input type="checkbox" name="Notifications" id="" />
                <label htmlFor="">
                  Information on new products and services Marketing and promo
                  offers
                </label>
              </div>
              <div className="flex gap-10">
                <label htmlFor=""></label>
                <input
                  className="ms-[120px]"
                  type="checkbox"
                  name="security"
                  id=""
                />
                <label htmlFor="">Security alerts</label>
              </div>
              <div className="savebtn">
                <button className="p-2 rounded-md text-white hover:bg-blue-700 ms-[22vw] mt-6 bg-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

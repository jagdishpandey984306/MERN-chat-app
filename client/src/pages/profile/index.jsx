import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "../../utils/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utils/constants";
import { apiClient } from "@/lib/api-client";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [hovered, setHovered] = useState(false);

  const fileInputRef = useRef(null);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("Firstname is required");
      return false;
    }
    if (!lastName) {
      toast.error("Lastname is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          firstName,
          lastName,
          color: selectedColor,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setUserInfo({ ...response.data.user });
        navigate("/chat");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if (userInfo.image) {
      setProfileImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const formdata = new FormData();
      formdata.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formdata, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserInfo({ ...userInfo, profileImage: response.data.image });
        setProfileImage(`${HOST}/${response.data.image}`);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const handleDeleteImage = async (event) => {
    const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
      withCredentials: true,
    });
    if (response.data.success) {
      setUserInfo({ ...userInfo, profileImage: null });
      setProfileImage(null);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white text-opacity-90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {profileImage ? (
                <AvatarImage
                  src={profileImage}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full
                     ${getColor(selectedColor)}
                     `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={
                  profileImage ? handleDeleteImage : handleFileInputClick
                }
              >
                {profileImage ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onClick={handleImageChange}
              name="profile-image"
              accept=".png, .jpeg, .jpg, .svg, .webp"
            />
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full">
              <Input
                placeholder="first name"
                type="text"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full">
              <Input
                placeholder="last name"
                type="text"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => {
                return (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }
                  `}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

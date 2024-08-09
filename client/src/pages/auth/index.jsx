import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constants";
import { LOGIN_ROUTE } from "../../utils/constants";
import { useAppStore } from "../../store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const validateLogin = () => {
    if (!data.email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!data.password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUserInfo(response.data.user);
        navigate(response.data.user.profileSetup ? "/chat" : "/profile");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  const validateSignup = () => {
    if (!data.email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!data.password.length) {
      toast.error("Password is required");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Password and  Confirm Password should be same");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUserInfo(response.data.user);
        navigate("/profile");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw]   flex items=-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  className="rounded-full p-6"
                  value={data.email}
                  onChange={onChangeHandler}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  className="rounded-full p-6"
                  value={data.password}
                  onChange={onChangeHandler}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={data.email}
                  name="email"
                  onChange={onChangeHandler}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={data.password}
                  name="password"
                  onChange={onChangeHandler}
                />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={onChangeHandler}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background login" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;

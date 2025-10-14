"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type inputValues = {
  email: string;
  password: string;
  username: string;
};

type DecodedToken = {
  data: {
    _id: string;
    email: string;
    username: string;
    bio: string | null;
    profilePicture: string | null;
    password: string;
  };
};

const Page = () => {
  const { setUser, user } = useUser();
  const [inputValues, handleInputValues] = useState<inputValues>({
    email: "",
    password: "",
    username: "",
  });
  const InputValues = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      handleInputValues({ ...inputValues, email: value });
    }
    if (name === "password") {
      handleInputValues({ ...inputValues, password: value });
    }
    if (name === "username") {
      handleInputValues({ ...inputValues, username: value });
    }
  };
  const { push } = useRouter();

  const signup = async () => {
    const response = await fetch("http://localhost:5555/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
        username: inputValues.username,
      }),
    });

    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);

      const decodedToken: DecodedToken = jwtDecode(token);
      setUser(decodedToken.data);
      toast.success("successfully sign in ");
      push("/");
    } else {
      toast.error("existing ");
    }
  };
  console.log(inputValues);

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div>
      <IG_LOGO />
      <Input
        placeholder="username"
        name="username"
        onChange={(e) => InputValues(e)}
      />
      <Input
        placeholder="email"
        name="email"
        onChange={(e) => InputValues(e)}
      />
      <Input
        placeholder="password"
        name="password"
        onChange={(e) => InputValues(e)}
      />

      <Button onClick={signup}>sign in</Button>
    </div>
  );
};

export default Page;

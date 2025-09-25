"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";

type inputValues = {
  email: string;
  password: string;
};

const Page = () => {
  const { setUser, user } = useUser();
  const { push } = useRouter();

  const [inputValues, setInputValues] = useState<inputValues>({
    email: "",
    password: "",
  });

  const InputValues = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setInputValues({ ...inputValues, email: value });
    }
    if (name === "password") {
      setInputValues({ ...inputValues, password: value });
    }
  };

  const login = async () => {
    const response = await fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inputValues.email,
        password: inputValues.password,
      }),
    });
    //  const user = await response.json();
    //  localStorage.setItem("user" , JSON.stringify(user));
    //  setUser(user);

    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      push("/");
      toast.success("successfully loged in");
    } else {
      toast.error("try again ");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div>
      <IG_LOGO />
      <Input
        placeholder="email"
        name="email"
        value={inputValues.email}
        onChange={(e) => InputValues(e)}
      />
      <Input
        placeholder="password"
        value={inputValues.password}
        name="password"
        onChange={(e) => InputValues(e)}
      />
      <Button onClick={login}>Login</Button>
    </div>
  );
};

export default Page;

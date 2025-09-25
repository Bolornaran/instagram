"use client";

import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) push("/login");
  }, [user]);

  return <div>INSTAGRAM</div>;
}

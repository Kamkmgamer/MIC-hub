'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function Onboarding() {
  const router = useRouter();
  const [role, setRole] = useState<"business" | "influencer">("business");

  const updateUserRole = api.user.updateRole.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleRoleSelection = () => {
    updateUserRole.mutate({ role });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to Mic-Hub
        </h1>
        <p className="text-2xl">Tell us who you are</p>
        <div className="flex gap-4">
          <button
            onClick={() => setRole("business")}
            className={`rounded-xl p-4 ${role === "business" ? "bg-white/20" : "bg-white/10"}`}>
            I am a Business
          </button>
          <button
            onClick={() => setRole("influencer")}
            className={`rounded-xl p-4 ${role === "influencer" ? "bg-white/20" : "bg-white/10"}`}>
            I am an Influencer
          </button>
        </div>
        <button
          onClick={handleRoleSelection}
          className="rounded-xl bg-white/10 p-4 hover:bg-white/20">
          Continue
        </button>
      </div>
    </main>
  );
}

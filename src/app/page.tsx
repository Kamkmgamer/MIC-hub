'use client';

import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goals, setGoals] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getLatestCampaign = api.campaign.getLatest.useQuery();
  const createCampaign = api.campaign.create.useMutation({
    onSuccess: () => {
        void getLatestCampaign.refetch();
    }
  });

  const handleCreateCampaign = () => {
    createCampaign.mutate({ 
      name, 
      description, 
      budget: parseFloat(budget), 
      businessId: 1, 
      targetAudience, 
      goals, 
      startDate: new Date(startDate), 
      endDate: new Date(endDate) 
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <SignedIn>
                <Link href="/dashboard" className="text-white hover:underline">
                    Dashboard
                </Link>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </div>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Micro-Influencer Hub
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {getLatestCampaign.data
              ? `Latest Campaign: ${getLatestCampaign.data.name}`
              : "Loading campaigns..."}
          </p>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4">
            <input
                type="text"
                placeholder="Campaign Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <textarea
                placeholder="Campaign Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <input
                type="text"
                placeholder="Target Audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <input
                type="text"
                placeholder="Goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl bg-white/10 p-4 text-white"
            />
            <button
                onClick={handleCreateCampaign}
                className="rounded-xl bg-white/10 p-4 hover:bg-white/20"
            >
                Create Campaign
            </button>
        </div>
      </div>
    </main>
  );
}

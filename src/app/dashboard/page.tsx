'use client';

import { api } from "~/trpc/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: campaigns, isLoading } = api.campaign.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Campaign Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns?.map((campaign) => (
                <Link href={`/campaign/${campaign.id}`} key={campaign.id}>
                    <div className="bg-white/10 p-4 rounded-lg h-full">
                        <h2 className="text-2xl font-bold">{campaign.name}</h2>
                        <p>{campaign.description}</p>
                        <p className="text-lg font-bold mt-2">Budget: ${campaign.budget}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

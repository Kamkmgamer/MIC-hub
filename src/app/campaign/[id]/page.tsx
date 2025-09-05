'use client';

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function CampaignPage() {
  const { id } = useParams();
  const { data: campaign, isLoading } = api.campaign.getById.useQuery({
    id: Number(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{campaign.name}</h1>
        <p>{campaign.description}</p>
        <p className="text-lg font-bold mt-2">Budget: ${campaign.budget}</p>
        <p>Target Audience: {campaign.targetAudience}</p>
        <p>Goals: {campaign.goals}</p>
        <p>Start Date: {campaign.startDate?.toLocaleDateString()}</p>
        <p>End Date: {campaign.endDate?.toLocaleDateString()}</p>
      </div>
    </main>
  );
}

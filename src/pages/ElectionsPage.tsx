'use client'

import { MainLayout } from "@/components/layout/MainLayout";
import { ElectionCard } from "@/components/elections/ElectionCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Election = {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "Active" | "Upcoming" | "Completed";
};

const ElectionsPage = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [countdowns, setCountdowns] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchElections = async () => {
      const { data, error } = await supabase.from("elections").select("*");
      if (!error && data) {
        setElections(
          data
            .map((item: any) => {
              const id = item.id;
              if (!id || typeof id !== "string") {
                console.warn("Invalid election id:", item.id, item);
                return null;
              }
              return {
                id,
                title: item.title,
                date: item.end_date || "",
                description: item.description,
                status: item.is_active ? "Active" : "Completed",
              };
            })
            .filter(Boolean) as Election[]
        );
      }
    };
    fetchElections();
  }, []);

  const getTimeRemaining = (date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { str: "Ended", ms: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { str: `${days}d ${hours}h ${minutes}m ${seconds}s`, ms: diff };
  };

  // Set up countdowns and update election status
  useEffect(() => {
    if (elections.length === 0) return;

    const interval = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const updatedCountdowns: { [id: string]: string } = {};
        elections.forEach((election) => {
          const { str } = getTimeRemaining(election.date);
          updatedCountdowns[election.id] = str;
        });
        return updatedCountdowns;
      });

      setElections((prevElections) =>
        prevElections.map((election) => {
          const { ms } = getTimeRemaining(election.date);
          if (election.status === "Active" && ms <= 0) {
            return { ...election, status: "Completed" };
          }
          return election;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [elections]);

  // Only show active elections with countdown not ended
  const activeElections = elections.filter((election) => {
    const countdown = countdowns[election.id];
    return election.status === "Active" && countdown !== "Ended";
  });

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Active Elections"
          subtitle="View and participate in currently active elections."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for an election..."
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter elections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {elections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <ElectionCard
                key={election.id}
                id={election.id}
                title={election.title}
                date={election.date}
                description={election.description}
                status={election.status}
                timeRemaining={countdowns[election.id] || ""}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No active elections at the moment.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ElectionsPage;


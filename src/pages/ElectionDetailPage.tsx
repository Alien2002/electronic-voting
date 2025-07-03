import { MainLayout } from "@/components/layout/MainLayout";
import { BallotCard } from "@/components/elections/BallotCard";
import { Link, useParams } from "react-router-dom";
import { CalendarIcon, ClockIcon, ChevronLeftIcon, AlertTriangleIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PollStation } from "@/components/elections/PollStation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Candidate = {
  id: string;
  name: string;
};
type Position = {
  title: string;
  candidates: Candidate[];
};
type Election = {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "Active" | "Upcoming" | "Completed";
  positions: Position[];
};

const ElectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Helper for countdown
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

  useEffect(() => {
    const fetchElection = async () => {
      setLoading(true);
      // Fetch election
      const { data: electionData, error: electionError } = await supabase
        .from("elections")
        .select("*")
        .eq("id", id)
        .single();

      if (electionError || !electionData) {
        setElection(null);
        setLoading(false);
        return;
      }

      // Fetch candidates and group by position
      const { data: candidatesData, error: candidatesError } = await supabase
        .from("candidates")
        .select("id, name, position")
        .eq("election_id", id);

      if (candidatesError) {
        setElection(null);
        setLoading(false);
        return;
      }

      // Group candidates by position
      const positionsMap: { [title: string]: Candidate[] } = {};
      (candidatesData || []).forEach((candidate: any) => {
        if (!positionsMap[candidate.position]) {
          positionsMap[candidate.position] = [];
        }
        positionsMap[candidate.position].push({
          id: candidate.id,
          name: candidate.name,
        });
      });

      const positions: Position[] = Object.entries(positionsMap).map(
        ([title, candidates]) => ({
          title,
          candidates,
        })
      );

      setElection({
        id: electionData.id,
        title: electionData.title,
        date: electionData.end_date || "",
        description: electionData.description,
        status: electionData.is_active ? "Active" : "Completed",
        positions,
      });
      setTimeRemaining(getTimeRemaining(electionData.end_date || "").str);
      setLoading(false);
    };
    if (id) fetchElection();
  }, [id]);

  // Live countdown effect
  useEffect(() => {
    if (!election || !election.date) return;
    const updateCountdown = () => {
      const { str, ms } = getTimeRemaining(election.date);
      setTimeRemaining(str);
      if (election.status === "Active" && ms <= 0) {
        setElection((prev) =>
          prev ? { ...prev, status: "Completed" } : prev
        );
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [election]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <p className="text-gray-600">Loading election details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!election) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Election not found.</AlertDescription>
          </Alert>
          <Link to="/elections" className="mt-4 inline-block text-vote-blue hover:text-vote-teal">
            &larr; Back to Elections
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Link to="/elections" className="text-vote-blue hover:text-vote-teal flex items-center">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Elections
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-vote-blue mb-2">{election.title}</h1>
            <p className="text-gray-700 text-lg">{election.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-red-600 mr-3" />
              <span>Deadline Date: <strong>{new Date(election.date).toLocaleString()}</strong></span>
            </div>
            {timeRemaining && (
              <div className="flex items-center">
                <ClockIcon className={`h-5 w-5 ${election.status === "Active"? 'text-vote-teal' : 'text-red-600'} mr-3`} />
                <span>
                  {election.status === "Active" ? "Closes in: " : "Status: "}
                  <strong>{timeRemaining}</strong>
                </span>
              </div>
            )}
          </div>
          
          {election.status === "Active" && (
            <Alert className="mb-6 bg-blue-50 border-blue-300 text-blue-700">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">This Election is Active</AlertTitle>
              <AlertDescription>
                You can cast your vote for the positions listed below. Remember, you can only submit your ballot once.
              </AlertDescription>
            </Alert>
          )}
          {election.status === "Upcoming" && (
             <Alert className="mb-6 bg-yellow-50 border-yellow-300 text-yellow-700">
              <InfoIcon className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Upcoming Election</AlertTitle>
              <AlertDescription>
                This election is not yet active. Voting will open on {election.date}.
              </AlertDescription>
            </Alert>
          )}
           {election.status === "Completed" && (
             <Alert className="mb-6 bg-gray-100 border-gray-300 text-gray-700">
              <InfoIcon className="h-4 w-4 text-gray-600" />
              <AlertTitle className="text-gray-800">Election Completed</AlertTitle>
              <AlertDescription>
                Voting for this election has ended.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {election.status === "Active" && election.positions.map((position, index) => (
          <BallotCard 
            key={index}
            position={position.title}
            candidates={position.candidates}
            electionId={election.id}
          />
        ))}

        {election.status !== "Active" && election.positions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-vote-blue mb-4">Positions & Candidates</h2>
            {election.positions.map((position, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-medium text-vote-blue mb-2">{position.title}</h3>
                <ul className="list-disc list-inside pl-4 text-gray-700">
                  {position.candidates.map(candidate => (
                    <li key={candidate.id}>{candidate.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {(election.status === "Active" || election.status === "Completed") && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-vote-blue mb-6">
              {election.status === "Active" ? "Live Election Results" : "Final Election Results"}
            </h2>
            <PollStation electionId={election.id} />
          </div>
        )}

         <Alert className="mt-10">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Important Reminder</AlertTitle>
            <AlertDescription>
              If voting, you can only submit your ballot once and it cannot be changed after submission. 
              Please review your choices carefully.
            </AlertDescription>
          </Alert>
      </div>
    </MainLayout>
  );
};

export default ElectionDetailPage;

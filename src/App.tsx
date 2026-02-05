import React, { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { EventProposalForm } from "./components/EventProposalForm";
import { AcceptedProposals } from "./components/AcceptedProposals";
import { EventDocumentation } from "./components/EventDocumentation";
import { ReportsPage } from "./components/ReportsPage";

export type Page =
  | "home"
  | "proposal"
  | "dashboard"
  | "documentation"
  | "reports";

export interface Proposal {
  id: string;
  eventName: string;
  description: string;
  objective: string;
  date: string;
  requirements: string;
  coordinators: string;
  status: "approved" | "pending";
}

interface User {
  email: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProposal, setSelectedProposal] =
    useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      eventName: "Web Development Workshop",
      description:
        "A hands-on workshop on modern web development practices",
      objective:
        "Teach students React, Tailwind CSS, and modern web development best practices",
      date: "2026-02-15",
      requirements:
        "Projector, computers with internet access, development environment setup",
      coordinators: "Sarah Johnson, Michael Chen",
      status: "approved",
    },
    {
      id: "2",
      eventName: "AI & Machine Learning Seminar",
      description:
        "Introduction to AI and ML concepts for beginners",
      objective:
        "Introduce fundamental concepts of AI and machine learning to club members",
      date: "2026-02-22",
      requirements:
        "Conference room, presentation equipment, Python environment",
      coordinators: "Alex Kumar, Emily Rodriguez",
      status: "approved",
    },
  ]);

  const handleProposalSubmit = (
    proposal: Omit<Proposal, "id" | "status">,
  ) => {
    const newProposal: Proposal = {
      ...proposal,
      id: Date.now().toString(),
      status: "approved",
    };
    setProposals([...proposals, newProposal]);
    setCurrentPage("dashboard");
  };

  const handleUploadDocumentation = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setCurrentPage("documentation");
  };

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "home" && (
          <HomePage
            proposals={proposals}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === "proposal" && (
          <EventProposalForm onSubmit={handleProposalSubmit} />
        )}

        {currentPage === "dashboard" && (
          <AcceptedProposals
            proposals={proposals.filter(
              (p) => p.status === "approved",
            )}
            onUploadDocumentation={handleUploadDocumentation}
          />
        )}

        {currentPage === "documentation" &&
          selectedProposal && (
            <EventDocumentation proposal={selectedProposal} />
          )}

        {currentPage === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}

export default App;
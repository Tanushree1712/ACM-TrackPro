import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileUp } from 'lucide-react';
import { Proposal } from '../App';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

interface AcceptedProposalsProps {
  proposals: Proposal[];
  onUploadDocumentation: (proposal: Proposal) => void;
}

const statusStyles: Record<Proposal['status'], string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<Proposal['status'], string> = {
  approved: 'Approved',
  pending: 'Pending Review',
  rejected: 'Rejected',
};

export function AcceptedProposals({ proposals, onUploadDocumentation }: AcceptedProposalsProps) {
  const [fbProposals, setFbProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'proposals'), (snapshot) => {
      const fetchedProposals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proposal[];
      setFbProposals(fetchedProposals);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching submitted proposals: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const dashboardProposals = [
    ...fbProposals,
    ...proposals.filter((proposal) => !fbProposals.some((fbProposal) => fbProposal.id === proposal.id)),
  ].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

  if (loading && dashboardProposals.length === 0) {
    return <div className="text-center py-12 text-gray-500">Loading submitted proposals...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Submitted Proposals</h2>
        <p className="text-sm text-gray-600 mt-1">Track every submitted event and upload documentation once it is approved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{proposal.eventName}</h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[proposal.status]}`}>
                {statusLabels[proposal.status]}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {proposal.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(proposal.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{proposal.coordinators.split(',')[0].trim()}</span>
              </div>
            </div>

            {proposal.status === 'approved' ? (
              <button
                onClick={() => onUploadDocumentation(proposal)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition font-medium"
              >
                <FileUp className="w-4 h-4" />
                Upload Documentation
              </button>
            ) : (
              <div className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-center ${
                proposal.status === 'pending'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {proposal.status === 'pending'
                  ? 'Waiting for admin approval'
                  : 'This proposal was rejected'}
              </div>
            )}
          </div>
        ))}
      </div>

      {dashboardProposals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No proposals submitted yet.</p>
        </div>
      )}
    </div>
  );
}

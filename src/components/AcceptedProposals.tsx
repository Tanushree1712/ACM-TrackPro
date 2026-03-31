import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileUp } from 'lucide-react';
import { Proposal } from '../App';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface AcceptedProposalsProps {
  onUploadDocumentation: (proposal: Proposal) => void;
}

export function AcceptedProposals({ onUploadDocumentation }: AcceptedProposalsProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'proposals'), where('status', '==', 'approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProposals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proposal[];
      setProposals(fetchedProposals);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching approved proposals: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading approved proposals...</div>;
  }
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Proposal Status</h2>
        <p className="text-sm text-gray-600 mt-1">Manage and document your approved events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{proposal.eventName}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Approved
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

            <button
              onClick={() => onUploadDocumentation(proposal)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition font-medium"
            >
              <FileUp className="w-4 h-4" />
              Upload Documentation
            </button>
          </div>
        ))}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No approved proposals yet.</p>
        </div>
      )}
    </div>
  );
}

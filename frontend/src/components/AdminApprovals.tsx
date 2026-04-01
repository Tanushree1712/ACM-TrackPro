import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import { Proposal } from '../App';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

interface AdminApprovalsProps {
  // If fallback local state is needed, we can receive proposals, but let's query Firestore first
  // and manually fallback if needed.
  proposals: Proposal[];
  onApproveLocal: (id: string, status: 'approved' | 'rejected') => void;
}

export function AdminApprovals({ proposals, onApproveLocal }: AdminApprovalsProps) {
  const [fbProposals, setFbProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore Snapshot for pending proposals
  useEffect(() => {
    const q = query(collection(db, 'proposals'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProposals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proposal[];
      setFbProposals(fetchedProposals);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending proposals: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Merge Firestore proposals with Local strictly for fallback mechanism viewing
  // If a mock user adds a proposal and Firebase hangs, it ends up in `proposals` local state as 'pending'.
  const pendingProposals = [
     ...fbProposals,
     ...proposals.filter(p => p.status === 'pending' && !fbProposals.some(fb => fb.id === p.id))
  ];

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Optimistic local update
      onApproveLocal(id, newStatus);
      
      // Attempt Firebase update in background without awaiting (to prevent mock login hang)
      const proposalRef = doc(db, 'proposals', id);
      updateDoc(proposalRef, { status: newStatus }).catch(err => console.error("Firebase update failed locally:", err));
      
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status locally.");
    }
  };

  if (loading && pendingProposals.length === 0) {
    return <div className="text-center py-12 text-gray-500">Loading pending proposals...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Pending Approvals</h2>
        <p className="text-sm text-gray-600 mt-1">Review and manage new event requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-md transition relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>
            
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg pr-4">{proposal.eventName}</h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full shrink-0">
                Pending Review
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {proposal.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(proposal.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span className="truncate">{proposal.coordinators}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleUpdateStatus(proposal.id, 'approved')}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(proposal.id, 'rejected')}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 rounded-lg transition font-medium text-sm border border-red-200"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingProposals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No pending proposals to review.</p>
        </div>
      )}
    </div>
  );
}

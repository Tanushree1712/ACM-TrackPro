import React from 'react';
import { Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { Proposal } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  proposals: Proposal[];
  onNavigate: (page: 'proposal' | 'dashboard' | 'documentation' | 'reports') => void;
}

const eventImages = [
  {
    url: 'https://images.unsplash.com/photo-1569653402334-2e98fbaa80ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwd29ya3Nob3AlMjBzdHVkZW50cyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY5NzA3ODk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'College Workshop'
  },
  {
    url: 'https://images.unsplash.com/photo-1760952851538-17a59f691efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc2OTcwNzg5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Programming Workshop'
  },
  {
    url: 'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc2VtaW5hciUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3Njk3MDc4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Tech Seminar'
  },
  {
    url: 'https://images.unsplash.com/photo-1472691681358-fdf00a4bfcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaGFja2F0aG9uJTIwZXZlbnR8ZW58MXx8fHwxNzY5NzA3ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Hackathon Event'
  }
];

export function HomePage({ proposals, onNavigate }: HomePageProps) {
  const approvedProposals = proposals.filter(p => p.status === 'approved');

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome to ACM Event Manager</h1>
        <p className="text-gray-600">Manage and document your technical club events efficiently</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Events List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {approvedProposals.length > 0 ? (
              approvedProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{proposal.eventName}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Approved
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {proposal.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{new Date(proposal.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{proposal.coordinators}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Campus Hall</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 mb-4">No upcoming events scheduled</p>
                <button
                  onClick={() => onNavigate('proposal')}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition font-medium"
                >
                  Submit New Proposal
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('proposal')}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition text-sm font-medium text-gray-700 shadow-sm"
              >
                📝 Submit New Event Proposal
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition text-sm font-medium text-gray-700 shadow-sm"
              >
                📊 View Submitted Proposals
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Event Images */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Event Gallery</h2>
            <p className="text-sm text-gray-600 mt-1">Highlights from our recent events</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {eventImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition aspect-square group"
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600 mb-1">
                {approvedProposals.length}
              </div>
              <div className="text-xs text-gray-600">Active Events</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600 mb-1">24</div>
              <div className="text-xs text-gray-600">Total Events</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600 mb-1">850+</div>
              <div className="text-xs text-gray-600">Participants</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

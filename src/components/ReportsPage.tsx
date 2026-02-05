import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EventReport {
  id: string;
  eventName: string;
  date: string;
  month: string;
  year: number;
  attendees: number;
  duration: number; // in hours
  avgFeedbackRating: number;
  feedbackCount: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function ReportsPage() {
  const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState(2026);

  // Mock data for event reports
  const eventReports: EventReport[] = [
    {
      id: '1',
      eventName: 'Web Development Workshop',
      date: '2026-02-15',
      month: 'February',
      year: 2026,
      attendees: 85,
      duration: 2,
      avgFeedbackRating: 4.5,
      feedbackCount: 78
    },
    {
      id: '2',
      eventName: 'AI & Machine Learning Seminar',
      date: '2026-02-22',
      month: 'February',
      year: 2026,
      attendees: 92,
      duration: 1.5,
      avgFeedbackRating: 4.7,
      feedbackCount: 85
    },
    {
      id: '3',
      eventName: 'Hackathon 2026',
      date: '2026-01-20',
      month: 'January',
      year: 2026,
      attendees: 120,
      duration: 8,
      avgFeedbackRating: 4.8,
      feedbackCount: 110
    },
    {
      id: '4',
      eventName: 'Cloud Computing Workshop',
      date: '2026-01-10',
      month: 'January',
      year: 2026,
      attendees: 65,
      duration: 2,
      avgFeedbackRating: 4.3,
      feedbackCount: 58
    },
    {
      id: '5',
      eventName: 'Cybersecurity Awareness',
      date: '2025-12-15',
      month: 'December',
      year: 2025,
      attendees: 75,
      duration: 1.5,
      avgFeedbackRating: 4.4,
      feedbackCount: 68
    },
    {
      id: '6',
      eventName: 'Mobile App Development',
      date: '2025-11-18',
      month: 'November',
      year: 2025,
      attendees: 88,
      duration: 2.5,
      avgFeedbackRating: 4.6,
      feedbackCount: 82
    }
  ];

  // Filter by year
  const filteredReports = eventReports.filter(report => report.year === selectedYear);

  // Attendance data for bar chart
  const attendanceData = filteredReports.map(report => ({
    name: report.eventName.length > 15 ? report.eventName.substring(0, 15) + '...' : report.eventName,
    attendees: report.attendees,
    feedback: report.feedbackCount
  }));

  // Duration distribution for pie chart
  const durationData = [
    { name: '1-2 hrs', value: filteredReports.filter(r => r.duration >= 1 && r.duration <= 2).length },
    { name: '2-3 hrs', value: filteredReports.filter(r => r.duration > 2 && r.duration <= 3).length },
    { name: '3+ hrs', value: filteredReports.filter(r => r.duration > 3).length }
  ];

  // Monthly trends for line chart
  const monthlyTrends = Object.values(
    filteredReports.reduce((acc, report) => {
      if (!acc[report.month]) {
        acc[report.month] = {
          month: report.month,
          totalAttendees: 0,
          avgRating: 0,
          eventCount: 0
        };
      }
      acc[report.month].totalAttendees += report.attendees;
      acc[report.month].avgRating += report.avgFeedbackRating;
      acc[report.month].eventCount += 1;
      return acc;
    }, {} as Record<string, any>)
  ).map(item => ({
    month: item.month,
    totalAttendees: item.totalAttendees,
    avgRating: Number((item.avgRating / item.eventCount).toFixed(1))
  }));

  // Summary statistics
  const totalEvents = filteredReports.length;
  const totalAttendees = filteredReports.reduce((sum, r) => sum + r.attendees, 0);
  const avgAttendees = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;
  const avgRating = totalEvents > 0 
    ? (filteredReports.reduce((sum, r) => sum + r.avgFeedbackRating, 0) / totalEvents).toFixed(1)
    : '0.0';

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Event Reports & Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Track event performance and attendance metrics</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('monthly')}
            className={`px-4 py-2 rounded-lg transition ${
              viewType === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly View
          </button>
          <button
            onClick={() => setViewType('yearly')}
            className={`px-4 py-2 rounded-lg transition ${
              viewType === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Yearly View
          </button>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">{totalEvents}</div>
          <div className="text-sm text-gray-600">Total Events</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">{totalAttendees}</div>
          <div className="text-sm text-gray-600">Total Attendees</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">{avgAttendees}</div>
          <div className="text-sm text-gray-600">Avg Attendees</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">{avgRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Event Reports List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Event Reports</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                >
                  <h4 className="font-medium text-gray-900 text-sm mb-2">{report.eventName}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      {report.attendees} attendees
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {report.duration} hrs
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {report.avgFeedbackRating}/5.0
                    </div>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No events found for {selectedYear}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Graphs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendees" fill="#3B82F6" name="Attendees" />
                <Bar dataKey="feedback" fill="#10B981" name="Feedback Responses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends Line Chart */}
          {monthlyTrends.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="totalAttendees" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Total Attendees"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="avgRating" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Avg Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Duration Distribution Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Duration Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={durationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {durationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-600">
              Most events run for 1-2 hours duration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

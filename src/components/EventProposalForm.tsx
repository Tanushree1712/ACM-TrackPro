import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Proposal } from '../App';

interface EventProposalFormProps {
  onSubmit: (proposal: Omit<Proposal, 'id' | 'status'>) => void;
}

export function EventProposalForm({ onSubmit }: EventProposalFormProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    objective: '',
    date: '',
    requirements: '',
    coordinators: ''
  });
  const [fileName, setFileName] = useState<string>('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Submit Event Proposal</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details for your event proposal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              id="eventName"
              required
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="e.g., React Workshop 2026"
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Event Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
              placeholder="Provide a detailed description of the event..."
            />
          </div>

          {/* Event Objective */}
          <div>
            <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
              Event Objective *
            </label>
            <textarea
              id="objective"
              required
              rows={3}
              value={formData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
              placeholder="What are the main goals of this event?"
            />
          </div>

          {/* Proposed Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Date *
            </label>
            <input
              type="date"
              id="date"
              required
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              id="requirements"
              required
              rows={3}
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
              placeholder="List equipment, resources, or facilities needed..."
            />
          </div>

          {/* Coordinators */}
          <div>
            <label htmlFor="coordinators" className="block text-sm font-medium text-gray-700 mb-2">
              Coordinators & Co-Coordinators *
            </label>
            <input
              type="text"
              id="coordinators"
              required
              value={formData.coordinators}
              onChange={(e) => handleInputChange('coordinators', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Names separated by commas"
            />
          </div>

          {/* Upload Proposal PDF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Proposal PDF
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdfUpload"
              />
              <label
                htmlFor="pdfUpload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
              >
                {fileName ? (
                  <>
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">{fileName}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload PDF</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* AI Notice */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Your proposal will be summarized by AI and sent to faculty for review.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-medium shadow-sm"
          >
            Submit Proposal
          </button>
        </div>
      </form>
    </div>
  );
}

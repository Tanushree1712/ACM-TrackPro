import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Proposal } from '../App';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

interface EventProposalFormProps {
  user: {
    email: string;
    name: string;
    role?: 'admin' | 'user';
  };
  onSubmit: (proposal: Omit<Proposal, 'id' | 'status'>) => void;
}

interface ProposalEmailResponse {
  ok: boolean;
  recipients: string[];
  messageId: string;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Could not read the PDF file.'));
    };

    reader.onerror = () => reject(new Error('Could not read the PDF file.'));
    reader.readAsDataURL(file);
  });
}

export function EventProposalForm({ user, onSubmit }: EventProposalFormProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    objective: '',
    date: '',
    requirements: '',
    coordinators: ''
  });
  const [fileName, setFileName] = useState<string>('');
  const [proposalPdf, setProposalPdf] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProposalPdf(file);
      setFileName(file.name);
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!proposalPdf) {
      setSubmitError('Please attach the proposal PDF before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/proposals/submit` : '/api/proposals/submit';
      const pdfDataUrl = await fileToDataUrl(proposalPdf);

      const emailResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal: formData,
          submittedBy: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          pdfAttachment: {
            name: proposalPdf.name,
            type: proposalPdf.type || 'application/pdf',
            size: proposalPdf.size,
            dataBase64: pdfDataUrl,
          },
        }),
      });

      const emailResult = (await emailResponse.json()) as ProposalEmailResponse & { error?: string };
      if (!emailResponse.ok) {
        throw new Error(emailResult.error || 'The proposal email could not be sent to faculty.');
      }

      // Fire-and-forget Firebase sync to avoid hanging the UI if DB isn't configured/connected
      addDoc(collection(db, 'proposals'), {
        ...formData,
        proposalPdfName: proposalPdf.name,
        submittedByName: user.name,
        submittedByEmail: user.email,
        status: 'pending',
        createdAt: new Date().toISOString()
      }).catch(err => console.error("Firebase sync error:", err));

      // Immediately update local UI state
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit proposal and email it to faculty.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Submit Event Proposal</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details for your event proposal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {submitError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

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
                required
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition font-medium shadow-sm"
          >
            {isSubmitting ? 'Submitting And Emailing Faculty...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
}

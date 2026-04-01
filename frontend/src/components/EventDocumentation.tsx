import React, { useState } from 'react';
import { Upload, X, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Proposal } from '../App';

interface EventDocumentationProps {
  proposal: Proposal;
}

interface ChecklistItem {
  label: string;
  completed: boolean;
  note: string;
}

interface AiReport {
  summary: string;
  actionItems: string[];
  reportMarkdown: string;
  confidenceNote: string;
}

interface ReportResponse {
  checklist: ChecklistItem[];
  missingItems: string[];
  completedCount: number;
  totalRequired: number;
  aiReport: AiReport | null;
  model: string | null;
  warning?: string;
}

export function EventDocumentation({ proposal }: EventDocumentationProps) {
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [resources, setResources] = useState('');
  const [attendees, setAttendees] = useState('');
  const [posterFile, setPosterFile] = useState<string>('');
  const [photoFiles, setPhotoFiles] = useState<string[]>([]);
  const [feedbackFile, setFeedbackFile] = useState<string>('');
  const [reportResult, setReportResult] = useState<ReportResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPosterFile(file.name);
  };

  const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files.map(f => f.name));
  };

  const handleFeedbackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFeedbackFile(file.name);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setReportResult(null);

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787').replace(/\/$/, '');
      const response = await fetch(`${apiBaseUrl}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal,
          documentation: {
            members,
            resources,
            attendees,
            posterFile,
            photoFiles,
            feedbackFile,
          },
        }),
      });

      const data = (await response.json()) as ReportResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate the event report.');
      }

      setReportResult(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not generate the event report. Make sure the backend server is running.';
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Event Documentation</h2>
        <p className="text-sm text-gray-600 mt-1">{proposal.eventName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Documentation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Read-only Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Proposal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Objective</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {proposal.objective}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {proposal.requirements}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordinators & Co-Coordinators</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {proposal.coordinators}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-6">
              {/* Members' Names */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Members' Names</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    placeholder="Enter member name and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {members.map((member, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {member}
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources Used */}
              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                  Resources Used
                </label>
                <textarea
                  id="resources"
                  rows={3}
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
                  placeholder="List all resources and materials used..."
                />
              </div>

              {/* Number of Attendees */}
              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  id="attendees"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                  placeholder="e.g., 45"
                />
              </div>

              {/* Upload Event Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Event Poster</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                  id="posterUpload"
                />
                <label
                  htmlFor="posterUpload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                >
                  {posterFile ? (
                    <>
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{posterFile}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload poster</span>
                    </>
                  )}
                </label>
              </div>

              {/* Upload Event Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Event Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosUpload}
                  className="hidden"
                  id="photosUpload"
                />
                <label
                  htmlFor="photosUpload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {photoFiles.length > 0 ? `${photoFiles.length} photo(s) selected` : 'Click to upload photos'}
                  </span>
                </label>
              </div>

              {/* Upload Feedback Excel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Google Form Feedback Excel Sheet
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFeedbackUpload}
                  className="hidden"
                  id="feedbackUpload"
                />
                <label
                  htmlFor="feedbackUpload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                >
                  {feedbackFile ? (
                    <>
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{feedbackFile}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload Excel sheet</span>
                    </>
                  )}
                </label>
              </div>

              {/* Generate Report Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-medium shadow-sm"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? 'Generating Report...' : 'Generate Event Report'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Report Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Documentation Readiness</h3>
            </div>

            {reportResult ? (
              <>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="text-sm font-medium text-blue-900">
                    {reportResult.completedCount}/{reportResult.totalRequired} required items ready
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    This check is based on the fields filled in on this page.
                  </p>
                </div>

                {reportResult.missingItems.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">What is Missing</h4>
                    <div className="space-y-2">
                      {reportResult.checklist
                        .filter((item) => !item.completed)
                        .map((item) => (
                          <div
                            key={item.label}
                            className="rounded-lg border border-red-100 bg-red-50 p-3"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-red-900">{item.label}</div>
                                <div className="text-xs text-red-700 mt-1">{item.note}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-green-900">All required documentation is present.</div>
                        <div className="text-xs text-green-700 mt-1">
                          You can use the generated report as your draft summary.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Checklist</h4>
                  <div className="space-y-2">
                    {reportResult.checklist.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <div className="flex items-start gap-2">
                          {item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.label}</div>
                            <div className="text-xs text-gray-600 mt-1">{item.note}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {reportResult.warning && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-medium text-amber-900">AI generation note</div>
                    <p className="text-xs text-amber-800 mt-1">{reportResult.warning}</p>
                  </div>
                )}

                {reportResult.aiReport && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">AI Summary</h4>
                      <p className="text-sm text-gray-700 leading-6">{reportResult.aiReport.summary}</p>
                    </div>

                    {reportResult.aiReport.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommended Next Steps</h4>
                        <div className="space-y-2">
                          {reportResult.aiReport.actionItems.map((item, index) => (
                            <div key={`${item}-${index}`} className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <h4 className="text-sm font-semibold text-gray-900">Generated Report Draft</h4>
                        {reportResult.model && (
                          <span className="text-[11px] uppercase tracking-wide text-gray-500">
                            {reportResult.model}
                          </span>
                        )}
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-[420px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-6">
                          {reportResult.aiReport.reportMarkdown}
                        </pre>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">{reportResult.aiReport.confidenceNote}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Fill in the event details and click "Generate Event Report" to check what is missing and create a backend-powered AI draft.
                </p>
              </div>
            )}

            {generationError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="text-sm font-medium text-red-900">Could not generate report</div>
                <p className="text-xs text-red-700 mt-1">{generationError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

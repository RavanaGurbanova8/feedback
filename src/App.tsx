import React, { useState, useEffect } from 'react';
import { BarChart3, QrCode, Users, Sparkles } from 'lucide-react';
import FormBuilder from './components/FormBuilder';
import QRCodeDisplay from './components/QRCodeDisplay';
import FormResponse from './components/FormResponse';
import Dashboard from './components/Dashboard';
import SuccessMessage from './components/SuccessMessage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FormData, Response, AISummary } from './types';
import { generateAISummary } from './services/aiService';

type AppView = 'home' | 'create' | 'qr' | 'form' | 'dashboard' | 'success';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [forms, setForms] = useLocalStorage<FormData[]>('forms', []);
  const [responses, setResponses] = useLocalStorage<Response[]>('responses', []);
  const [aiSummaries, setAiSummaries] = useLocalStorage<AISummary[]>('aiSummaries', []);
  const [currentFormId, setCurrentFormId] = useState<string>('');
  const [formCreating, setFormCreating] = useState(false);
  const [responseSubmitting, setResponseSubmitting] = useState(false);
  const [summaryGenerating, setSummaryGenerating] = useState(false);

  const currentForm = forms.find(f => f.id === currentFormId);
  const currentResponses = responses.filter(r => r.formId === currentFormId);
  const currentAiSummary = aiSummaries.find(s => s.formId === currentFormId);

  // Check for form ID in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get('form');
    if (formId && forms.find(f => f.id === formId)) {
      setCurrentFormId(formId);
      setView('form');
    }
  }, [forms]);

  const handleCreateForm = async (formData: Omit<FormData, 'id' | 'createdAt'>) => {
    setFormCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newForm: FormData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      setForms([...forms, newForm]);
      setCurrentFormId(newForm.id);
      setView('qr');
    } finally {
      setFormCreating(false);
    }
  };

  const handleSubmitResponse = async (responseData: Omit<Response, 'id' | 'submittedAt'>) => {
    setResponseSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newResponse: Response = {
        ...responseData,
        id: Date.now().toString(),
        submittedAt: new Date()
      };
      
      setResponses([...responses, newResponse]);
      setView('success');
    } finally {
      setResponseSubmitting(false);
    }
  };

  const handleToggleFormStatus = () => {
    if (currentForm) {
      const updatedForms = forms.map(f =>
        f.id === currentFormId
          ? { ...f, isActive: !f.isActive, closedAt: f.isActive ? new Date() : undefined }
          : f
      );
      setForms(updatedForms);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!currentForm) return;
    
    setSummaryGenerating(true);
    try {
      const summary = await generateAISummary(currentFormId, currentResponses, currentForm.title);
      setAiSummaries([...aiSummaries.filter(s => s.formId !== currentFormId), summary]);
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
    } finally {
      setSummaryGenerating(false);
    }
  };

  const getFormUrl = (formId: string) => {
    return `${window.location.origin}${window.location.pathname}?form=${formId}`;
  };

  const resetToHome = () => {
    setView('home');
    setCurrentFormId('');
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {view === 'home' && (
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormFlow Analytics
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create anonymous forms, collect responses via QR codes, and get AI-powered insights in real-time.
              Perfect for hackathons, market research, and gathering feedback.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code Forms</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate QR codes instantly for anonymous form submissions. Perfect for events and quick surveys.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch responses come in live with interactive charts and comprehensive statistics.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get actionable summaries and recommendations powered by advanced AI analysis.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-6">
            <button
              onClick={() => setView('create')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <QrCode className="w-6 h-6" />
              Create New Form
            </button>

            {forms.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Forms</h2>
                <div className="grid gap-6 max-w-4xl mx-auto">
                  {forms.map((form) => {
                    const formResponses = responses.filter(r => r.formId === form.id);
                    return (
                      <div key={form.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{form.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{formResponses.length} responses</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                form.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {form.isActive ? 'Active' : 'Closed'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setCurrentFormId(form.id);
                                setView('qr');
                              }}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                            >
                              View QR
                            </button>
                            <button
                              onClick={() => {
                                setCurrentFormId(form.id);
                                setView('dashboard');
                              }}
                              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                            >
                              Dashboard
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="container mx-auto px-6 py-12">
          <FormBuilder onSave={handleCreateForm} loading={formCreating} />
        </div>
      )}

      {view === 'qr' && currentForm && (
        <div className="container mx-auto px-6 py-12">
          <QRCodeDisplay
            formId={currentForm.id}
            formTitle={currentForm.title}
            formUrl={getFormUrl(currentForm.id)}
          />
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={() => setView('dashboard')}
              className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium"
            >
              View Dashboard
            </button>
            <button
              onClick={resetToHome}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {view === 'form' && currentForm && (
        <div className="container mx-auto px-6 py-12">
          <FormResponse
            form={currentForm}
            onSubmit={handleSubmitResponse}
            onBack={resetToHome}
            loading={responseSubmitting}
          />
        </div>
      )}

      {view === 'dashboard' && currentForm && (
        <div className="container mx-auto px-6 py-12">
          <Dashboard
            form={currentForm}
            responses={currentResponses}
            onBack={resetToHome}
            onToggleForm={handleToggleFormStatus}
            aiSummary={currentAiSummary}
            onGenerateSummary={currentForm.isActive ? undefined : handleGenerateAISummary}
            summaryLoading={summaryGenerating}
          />
        </div>
      )}

      {view === 'success' && (
        <div className="container mx-auto px-6 py-12">
          <SuccessMessage
            onViewResults={() => setView('dashboard')}
            onCreateAnother={resetToHome}
          />
        </div>
      )}
    </div>
  );
}

export default App;
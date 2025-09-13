import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, TrendingUp, Clock, Download, Sparkles, ArrowLeft } from 'lucide-react';
import { FormData, Response, FormStats, AISummary } from '../types';
import { calculateFormStats } from '../utils/analytics';
import { generateAISummary } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';
import { format } from 'date-fns';

interface DashboardProps {
  form: FormData;
  responses: Response[];
  onBack?: () => void;
  onToggleForm?: () => void;
  aiSummary?: AISummary;
  onGenerateSummary?: () => void;
  summaryLoading?: boolean;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard({ 
  form, 
  responses, 
  onBack, 
  onToggleForm, 
  aiSummary, 
  onGenerateSummary,
  summaryLoading = false
}: DashboardProps) {
  const [stats, setStats] = useState<FormStats>({ totalResponses: 0, questionStats: {} });

  useEffect(() => {
    const newStats = calculateFormStats(responses, form.questions);
    setStats(newStats);
  }, [responses, form.questions]);

  const exportData = () => {
    const exportData = {
      form: {
        title: form.title,
        description: form.description,
        createdAt: form.createdAt,
        closedAt: form.closedAt
      },
      responses: responses,
      stats: stats,
      aiSummary: aiSummary
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
            <p className="text-gray-600">
              Created {format(new Date(form.createdAt), 'MMM d, yyyy at h:mm a')}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${form.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {form.isActive ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {onToggleForm && (
              <button
                onClick={onToggleForm}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  form.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {form.isActive ? 'Close Form' : 'Reopen Form'}
              </button>
            )}
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
            >
              <Download size={20} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalResponses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Questions</p>
              <p className="text-3xl font-bold text-gray-900">{form.questions.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalResponses > 0 ? '95%' : '0%'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-3xl font-bold text-gray-900">2m 30s</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {stats.totalResponses === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No responses yet</h3>
          <p className="text-gray-600">Share your form to start collecting responses</p>
        </div>
      ) : (
        <>
          {/* Question Analytics */}
          <div className="space-y-8 mb-8">
            {form.questions.map((question, index) => {
              const questionStats = stats.questionStats[question.id];
              if (!questionStats) return null;

              return (
                <div key={question.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Question {index + 1}: {question.question}
                  </h3>

                  {question.type === 'multiple-choice' && questionStats.responses.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={questionStats.responses}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="value" 
                              tick={{ fontSize: 12 }}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={questionStats.responses}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {questionStats.responses.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {question.type === 'rating' && questionStats.responses.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={questionStats.responses.sort((a, b) => Number(a.value) - Number(b.value))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="value" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {question.type === 'text' && questionStats.textResponses && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-600">
                        {questionStats.textResponses.length} text response(s)
                      </p>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {questionStats.textResponses.slice(0, 10).map((response, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-gray-800 italic">"{response}"</p>
                          </div>
                        ))}
                        {questionStats.textResponses.length > 10 && (
                          <p className="text-sm text-gray-500 text-center">
                            And {questionStats.textResponses.length - 10} more responses...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Summary Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI-Powered Insights
              </h3>
              {!aiSummary && onGenerateSummary && (
                <button
                  onClick={onGenerateSummary}
                  disabled={summaryLoading || form.isActive}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {summaryLoading ? <LoadingSpinner size="sm" /> : <Sparkles size={20} />}
                  {summaryLoading ? 'Generating...' : 'Generate AI Summary'}
                </button>
              )}
            </div>

            {summaryLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <p className="text-gray-600">AI is analyzing responses...</p>
                </div>
              </div>
            )}

            {aiSummary && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">Summary</h4>
                  <p className="text-purple-800 leading-relaxed">{aiSummary.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">Key Insights</h4>
                    <ul className="space-y-2">
                      {aiSummary.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-blue-800">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4">Recommendations</h4>
                    <ul className="space-y-2">
                      {aiSummary.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-800">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Generated on {format(new Date(aiSummary.generatedAt), 'MMM d, yyyy at h:mm a')}
                </p>
              </div>
            )}

            {!aiSummary && !summaryLoading && form.isActive && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Close form to generate AI insights</h4>
                <p className="text-gray-600">AI analysis will be available once you close the form</p>
              </div>
            )}

            {!aiSummary && !summaryLoading && !form.isActive && !onGenerateSummary && (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>AI summary not available</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
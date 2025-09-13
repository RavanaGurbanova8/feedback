import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { FormData, Response } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface FormResponseProps {
  form: FormData;
  onSubmit: (response: Omit<Response, 'id' | 'submittedAt'>) => void;
  onBack?: () => void;
  loading?: boolean;
}

export default function FormResponse({ form, onSubmit, onBack, loading = false }: FormResponseProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    form.questions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id] === '')) {
        newErrors[question.id] = 'This question is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        formId: form.id,
        answers
      });
    }
  };

  if (!form.isActive) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Form Closed</h2>
          <p className="text-yellow-700">This form is no longer accepting responses.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-all duration-200 font-medium mx-auto"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {onBack && (
          <div className="px-8 pt-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
        )}

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{form.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {form.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'text' && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter your response..."
                  />
                )}

                {question.type === 'rating' && (
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleAnswerChange(question.id, rating)}
                        className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 font-bold ${
                          answers[question.id] === rating
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                    <span className="ml-4 text-sm text-gray-600">
                      (1 = Poor, 5 = Excellent)
                    </span>
                  </div>
                )}

                {errors[question.id] && (
                  <p className="text-red-600 text-sm font-medium">{errors[question.id]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Send size={20} />}
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
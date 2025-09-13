import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { FormData, Question } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface FormBuilderProps {
  onSave: (form: Omit<FormData, 'id' | 'createdAt'>) => void;
  loading?: boolean;
}

export default function FormBuilder({ onSave, loading = false }: FormBuilderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple-choice' ? [''] : undefined,
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, {
      options: [...(questions.find(q => q.id === questionId)?.options || []), '']
    });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question?.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && questions.length > 0) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        questions: questions.filter(q => q.question.trim()),
        isActive: true
      });
    }
  };

  const isFormValid = title.trim() && questions.length > 0 && questions.every(q => q.question.trim());

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create Your Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Form Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter your form title..."
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                placeholder="Describe what this form is about..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Questions</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple-choice')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                >
                  <Plus size={16} />
                  Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('text')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                >
                  <Plus size={16} />
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('rating')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                >
                  <Plus size={16} />
                  Rating
                </button>
              </div>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Question {index + 1} - {question.type.replace('-', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your question..."
                  />

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Options:</label>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          {question.options && question.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Required question</span>
                  </label>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-4">No questions added yet</p>
                <p className="text-sm">Click one of the buttons above to add your first question</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Save size={20} />}
              {loading ? 'Creating Form...' : 'Create Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
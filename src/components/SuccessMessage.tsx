import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessMessageProps {
  onViewResults?: () => void;
  onCreateAnother?: () => void;
}

export default function SuccessMessage({ onViewResults, onCreateAnother }: SuccessMessageProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your response has been submitted successfully. Your feedback is valuable and will help provide better insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onViewResults && (
            <button
              onClick={onViewResults}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
            >
              View Live Results
              <ArrowRight size={20} />
            </button>
          )}

          {onCreateAnother && (
            <button
              onClick={onCreateAnother}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 transition-all duration-200 font-semibold"
            >
              Create Another Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
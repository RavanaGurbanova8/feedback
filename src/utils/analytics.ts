import { Response, FormStats, Question } from '../types';

export function calculateFormStats(responses: Response[], questions: Question[]): FormStats {
  const questionStats: FormStats['questionStats'] = {};

  questions.forEach(question => {
    const questionId = question.id;
    const questionType = question.type;
    
    if (questionType === 'multiple-choice' || questionType === 'rating') {
      const answerCounts: Record<string, number> = {};
      
      responses.forEach(response => {
        const answer = response.answers[questionId];
        if (answer !== undefined) {
          const answerStr = String(answer);
          answerCounts[answerStr] = (answerCounts[answerStr] || 0) + 1;
        }
      });

      questionStats[questionId] = {
        type: questionType,
        responses: Object.entries(answerCounts).map(([value, count]) => ({
          value,
          count
        })).sort((a, b) => b.count - a.count)
      };
    } else if (questionType === 'text') {
      const textResponses = responses
        .map(response => response.answers[questionId])
        .filter(answer => answer && typeof answer === 'string')
        .map(answer => String(answer));

      questionStats[questionId] = {
        type: questionType,
        responses: [],
        textResponses
      };
    }
  });

  return {
    totalResponses: responses.length,
    questionStats
  };
}
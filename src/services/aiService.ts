import { Response, AISummary } from '../types';

// Mock AI service for hackathon MVP
// In production, this would connect to OpenAI, Claude, or another AI service
export async function generateAISummary(
  formId: string, 
  responses: Response[], 
  formTitle: string
): Promise<AISummary> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Analyze responses (simplified for MVP)
  const totalResponses = responses.length;
  const textResponses = responses.flatMap(r => 
    Object.values(r.answers).filter(answer => typeof answer === 'string' && answer.length > 10)
  );

  // Generate mock insights based on response patterns
  const insights = [
    `Collected ${totalResponses} responses with strong engagement`,
    `${Math.round(textResponses.length / totalResponses * 100)}% of responses included detailed feedback`,
    `Peak response time occurred between 2-4 PM`,
    'Most respondents showed positive sentiment towards the topic'
  ];

  const recommendations = [
    'Consider expanding the survey to reach more demographics',
    'Follow up with respondents who provided detailed feedback',
    'Implement suggested improvements from open-ended responses',
    'Schedule next survey during peak engagement hours'
  ];

  const summary = `Analysis of "${formTitle}" reveals strong participation with ${totalResponses} total responses. ` +
    `Key trends indicate high engagement levels and valuable qualitative feedback. ` +
    `The data suggests opportunities for deeper exploration of user preferences and behavioral patterns.`;

  return {
    formId,
    summary,
    keyInsights: insights.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    generatedAt: new Date()
  };
}
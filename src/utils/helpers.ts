export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getTotalQuestions = (sections: { questions: unknown[] }[]): number => {
  return sections.reduce((total, section) => total + section.questions.length, 0);
};

export const getAnsweredCount = (answers: Record<string, string | null | undefined>): number => {
  return Object.values(answers).filter(answer => answer !== null && answer !== undefined).length;
};

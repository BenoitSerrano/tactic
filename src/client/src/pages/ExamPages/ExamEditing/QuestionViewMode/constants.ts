const rightGrades = ['A'] as const;
type rightGradeType = (typeof rightGrades)[number];
const okGrades = ['B', 'C', 'D'] as const;
type okGradeType = (typeof okGrades)[number];

export { okGrades, rightGrades };
export type { rightGradeType, okGradeType };

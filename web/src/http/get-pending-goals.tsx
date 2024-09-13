export interface PendingGoalsResponse {
  pendingGoals: PendingGoal[];
}

export interface PendingGoal {
  id: string;
  title: string;
  weekFrequency: number;
  completionCount: number;  
}

export async function getPendingGoals(): Promise<PendingGoal[]> {
  const response = await fetch('http://localhost:3333/pending-goals');
  const data = await response.json();
  return data.pendingGoals;
}

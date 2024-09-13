import { db } from "../db";
import { goals } from "../db/schema";

interface CreateGoalRequest {
  title: string;
  weekFrequency: number;
}

export async function createGoal({ title, weekFrequency }: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      weekFrequency
    })
    .returning()
  ;

  const goal = result[0];

  return {
    goal,
  }
}
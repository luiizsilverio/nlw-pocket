import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { dayjs } from "../lib/dayjs";
import { db } from "../db";
import { completions, goals } from "../db/schema";

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({ goalId }: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  const totalGoalCompletions = db.$with('total_goal_completions').as(
    db
      .select({
        goalId: completions.goalId,
        total: count(completions.id).as('total')
      })
      .from(completions)
      .where(
        and(
          eq(completions.goalId, goalId),
          gte(completions.createdAt, firstDayOfWeek),
          lte(completions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(completions.goalId)
  )

  const result = await db
    .with(totalGoalCompletions)
    .select({
      weekFrequency: goals.weekFrequency,
      completionCount: sql`
        COALESCE(${totalGoalCompletions.total}, 0) AS completionCount
      `.mapWith(Number)
    })
    .from(goals)
    .leftJoin(totalGoalCompletions, eq(totalGoalCompletions.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

    const { completionCount, weekFrequency } = result[0];

    if (completionCount >= weekFrequency) {
      throw new Error('Goal already completed this week!');
    }

  const insertResult = await db
    .insert(completions)
    .values({ goalId })
    .returning()
  ;

  const completion = insertResult[0];

  return {
    completion
  }
}
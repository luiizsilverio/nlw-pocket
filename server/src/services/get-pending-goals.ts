import { and, count, lte, gte, eq, sql } from "drizzle-orm";
import { dayjs } from "../lib/dayjs";
import { db } from "../db";
import { completions, goals } from "../db/schema";

export async function getPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        weekFrequency: goals.weekFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  );

  const totalGoalCompletions = db.$with('total_goal_completions').as(
    db
      .select({
        goalId: completions.goalId,
        total: count(completions.id).as('total')
      })
      .from(completions)
      .where(
        and(
          gte(completions.createdAt, firstDayOfWeek),
          lte(completions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(completions.goalId)
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, totalGoalCompletions)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      weekFrequency: goalsCreatedUpToWeek.weekFrequency,
      completionCount: sql`
        COALESCE(${totalGoalCompletions.total}, 0)
      `.mapWith(Number)
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      totalGoalCompletions, 
      eq(totalGoalCompletions.goalId, goalsCreatedUpToWeek.id)
    )
    // .toSQL()

  return {pendingGoals};
}
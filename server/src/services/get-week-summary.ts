import { and, lte, gte, eq, sql, desc } from "drizzle-orm";
import { dayjs } from "../lib/dayjs";
import { db } from "../db";
import { completions, goals } from "../db/schema";

type GoalsPerDay = Record<string, {
  id: string;
  title: string;
  completedAt: string;
}[]>


export async function getWeekSummary() {
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

  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: completions.id,
        title: goals.title,
        completedAt: completions.createdAt,
        completedAtDate: sql`
          DATE(${completions.createdAt})
        `.as('completedAt')
      })
      .from(completions)
      .innerJoin(goals, eq(goals.id, completions.goalId))
      .where(
        and(
          gte(completions.createdAt, firstDayOfWeek),
          lte(completions.createdAt, lastDayOfWeek)
        )
      )
      .orderBy(completions.createdAt)
  );

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `
        .as('completions')
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  );

  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql`
        (SELECT COUNT(*) FROM ${goalsCompletedInWeek})
      `.mapWith(Number),
      total: sql`
        (SELECT SUM(${goalsCreatedUpToWeek.weekFrequency}) FROM ${goalsCreatedUpToWeek})
      `.mapWith(Number),
      goalsPerDay: sql<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `
    })
    .from(goalsCompletedByWeekDay);

  return { 
    summary: result[0]
  }
}
import { z } from 'zod';
import { FastifyInstance } from "fastify";
import { getPendingGoals } from "../services/get-pending-goals";
import { createGoal } from "../services/create-goal";
import { createGoalCompletion } from "../services/create-goal-completion";
import { getWeekSummary } from '../services/get-week-summary';

export async function routes(app: FastifyInstance) {

  app.get('/', () => {
    return 'NLW Pocket 🚀';
  })

  app.get('/pending-goals', async () => {
      const pendingGoals = await getPendingGoals();
      return pendingGoals;
  })

  app.post('/goals', async (request) => {
      const bodySchema = z.object({
          title: z.string(),
          weekFrequency: z.number().int().min(1).max(7)
      });

      const body = bodySchema.parse(request.body);

      return await createGoal({
          title: body.title,
          weekFrequency: body.weekFrequency,
      })
  })

  app.post('/completions', async (request) => {
      const bodySchema = z.object({
          goalId: z.string(),
      });

      const body = bodySchema.parse(request.body);

      await createGoalCompletion({
          goalId: body.goalId,
      })
  })

  app.get('/summary', async (request) => {
    return await getWeekSummary();
  })

}
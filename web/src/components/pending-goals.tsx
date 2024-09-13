import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OutlineButton } from "./ui/outline-button";
import { getPendingGoals } from "../http/get-pending-goals";
import { CreateGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['pending-goals'], // apenas um slug que identifica a query
    queryFn: getPendingGoals,   // função que faz a requisição
    staleTime: 1000 * 60   // revalidação a cada 60 segundos
  })

  if (!data) {
    return null;
  }

  async function handleCompleteGoal(goalId: string) {
    await CreateGoalCompletion(goalId);
    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
  }

  return (
    <div className="flex flex-wrap gap-3">

      {data.map(goal => (
        <OutlineButton 
          key={goal.id} 
          disabled={goal.completionCount >= goal.weekFrequency}
          onClick={() => handleCompleteGoal(goal.id)}
        >
          <Plus className="size-4 text-zinc-600" />
          {goal.title}
        </OutlineButton>
      ))}

    </div>
  )
}
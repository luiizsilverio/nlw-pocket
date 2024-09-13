import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Plus } from "lucide-react";
import logo from "../assets/in-orbit-icon.svg";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { getSummary } from "../http/get-summary";
import { dayjs } from "../lib/dayjs";
import { PendingGoals } from "./pending-goals";

export function Summary() {
  const { data } = useQuery({
    queryKey: ['summary'], // apenas um slug que identifica a query
    queryFn: getSummary,   // função que faz a requisição
    staleTime: 1000 * 60   // revalidação a cada 60 segundos
  })

  if (!data) {
    return null;
  }

  const firstDayOfWeek = dayjs().startOf('week').format('D[ de ]MMM');
  const lastDayOfWeek = dayjs().endOf('week').format('D[ de ]MMM');
  const completePerc = useMemo(() => Math.round(data.summary.completed / data.summary.total * 100), [data.summary]);

  return (
    <div className="py-10 px-5 mx-auto flex flex-col gap-6 max-w-[480px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" />
          <span className="text-lg font-semibold">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className='size-4' />
            Cadastrar meta
          </Button>      
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={data.summary.total} value={data.summary.completed}>
          <ProgressIndicator style={{ width: `${completePerc}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>
            Você completou <span className="text-zinc-100">{data.summary.completed}</span> de
            <span className="text-zinc-100"> {data.summary.total}</span> metas nessa semana.
          </span>
          <span>{completePerc}%</span>
        </div>

        <Separator />

        <PendingGoals />

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-medium">Sua semana</h2>

          {Object.entries(data.summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd');
            const diaMes = dayjs(date).format('D[ de ]MMMM');

            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay} </span> 
                  <span className="text-zinc-400 text-xs">({diaMes})</span>
                </h3>

                <ul className="flex flex-col gap-3">
                  {goals.map((goal) => {
                    const vdata = new Date(goal.completedAt);
                    return (
                      <li key={goal.id} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>" às {' '}
                          <span className="text-zinc-100">{dayjs(vdata).format("HH:mm")}h</span>
                        </span>
                      </li>
                    )
                  })} 
                </ul>
              </div>
            )
          })}
          
        </div>
      </div>
    </div>
  )
}
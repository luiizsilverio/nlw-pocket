import { useQuery } from '@tanstack/react-query';
import { Dialog } from './components/ui/dialog';
import { CreateGoal } from './components/create-goal';
import { Summary } from './components/summary';
import { EmptyGoal } from './components/empty-goal';
import { getSummary } from './http/get-summary';


function App() {
  
  const { data } = useQuery({
    queryKey: ['summary'], // apenas um slug que identifica a query
    queryFn: getSummary,   // função que faz a requisição
    staleTime: 1000 * 60   // revalidação a cada 60 segundos
  })

  return (
    <Dialog>

      {data && data.summary.total > 0 ? <Summary /> : <EmptyGoal />}

      <CreateGoal />  
          
    </Dialog>
  )
}

export default App

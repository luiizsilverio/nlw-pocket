import { Plus } from 'lucide-react';
import logo from '../assets/logo-in-orbit.svg';
import letStart from '../assets/lets-start-illustration.svg';
import { Button } from '../components/ui/button';
import { DialogTrigger } from '../components/ui/dialog';

export function EmptyGoal() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="NLW-Pocket logo" />
      <img src={letStart} alt="in.orbit" />
      <p className='text-zinc-300 leading-relaxed max-w-80 text-center'>
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className='size-4' />
          Cadastrar meta
        </Button>      
      </DialogTrigger>
    </div>
  )
}
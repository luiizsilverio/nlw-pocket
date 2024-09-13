import { Controller, useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { z } from 'zod';
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from '../components/ui/dialog';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGoal } from '../http/create-goal';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja realizar'),
  weekFrequency: z.coerce.number().min(1).max(7)
})

type CreateGoalForm = {
  title: string;
  weekFrequency: number;
}

export function CreateGoal() {
  const queryClient = useQueryClient();
  
  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(formSchema)
  });

  async function handleCreateGoal(data: CreateGoalForm) {
    await createGoal({ 
      title: data.title, 
      weekFrequency: data.weekFrequency
    });

    queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
    reset();
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className='flex flex-col gap-3'>
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className='size-5 text-zinc-600'/>
            </DialogClose>
          </div>

          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar praticando toda semana.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(handleCreateGoal)} className='flex flex-col justify-between flex-1'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='title'>Qual a atividade?</Label>
              <Input 
                autoFocus 
                id="title" 
                placeholder='Praticar exercícios, estudar etc...' 
                {...register('title')}
              />

              {formState.errors.title && (
                <p className='text-red-400 text-sm'>{formState.errors.title.message}</p>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <Label>Qual a atividade?</Label>

              <Controller
                control={control}
                name="weekFrequency"
                defaultValue={1}
                render={({ field }) => {
                  return (
                    <RadioGroup onValueChange={field.onChange} value={String(field.value)}>
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>1x na semana</span>
                        <span className='text-lg leading-none'>🥱</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>2x na semana</span>
                        <span className='text-lg leading-none'>😊</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>3x na semana</span>
                        <span className='text-lg leading-none'>😝</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>4x na semana</span>
                        <span className='text-lg leading-none'>😎</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>5x na semana</span>
                        <span className='text-lg leading-none'>🫥</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>6x na semana</span>
                        <span className='text-lg leading-none'>🤯</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className='text-zinc-300 text-sm font-medium leading-none'>Todos os dias da semana</span>
                        <span className='text-lg leading-none'>🔥</span>
                      </RadioGroupItem>                  
                    </RadioGroup>
                  )
                }}
              />

            </div>
          </div>

          <div className='flex items-center gap-3'>
            <DialogClose asChild>
              <Button type="button" variant='secondary' className='flex-1'>Fechar</Button>
            </DialogClose>
            <Button className='flex-1'>Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
interface CreateGoalRequest {
  title: string;
  weekFrequency: number;
}

export async function createGoal({ title, weekFrequency }: CreateGoalRequest) {
  await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      weekFrequency         
    })
  })
}
import { client, db } from ".";
import { completions, goals } from "./schema";

async function seed() {
  await db.delete(completions);
  await db.delete(goals);

  const result = await db.insert(goals).values([
    { title: 'Acordar cedo', weekFrequency: 5 },
    { title: 'Fazer exercícios', weekFrequency: 3 },
    { title: 'Ler livro', weekFrequency: 6 },
  ]).returning();

  await db.insert(completions).values([
    { goalId: result[0].id },
    { goalId: result[1].id },
  ])
}

seed().finally(() => {
  client.end()
})

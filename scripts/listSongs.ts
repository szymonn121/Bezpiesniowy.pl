import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function main() {
  const songs = await p.song.findMany({ orderBy: { id: 'asc' } });
  console.log(JSON.stringify(songs, null, 2));
  await p.$disconnect();
}

main().catch(async (e) => { console.error(e); await p.$disconnect(); process.exit(1); });

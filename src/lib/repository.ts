import { prisma } from "@/lib/prisma";

// Prosty fallback bez bazy danych: dane w pamięci procesu.
// Aktywacja: ustaw zmienną środowiskową USE_MEMORY_STORE=true lub brak DATABASE_URL.

type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  nickname?: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

type LeaderboardEntryRecord = {
  id: number;
  userId?: number | null;
  nickname: string;
  score: number;
  createdAt: Date;
};

const useMemory = process.env.USE_MEMORY_STORE === "true" || !process.env.DATABASE_URL;

const memory = (() => {
  let userIdCounter = 1;
  let leaderboardIdCounter = 1;
  const users: UserRecord[] = [];
  const leaderboard: LeaderboardEntryRecord[] = [];
  return {
    createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt"> & { nickname?: string | null }) {
      const now = new Date();
      const user: UserRecord = {
        id: userIdCounter++,
        email: data.email,
        passwordHash: data.passwordHash,
        nickname: data.nickname ?? null,
        role: data.role ?? "USER",
        createdAt: now,
        updatedAt: now,
      };
      users.push(user);
      return user;
    },
    findUserByEmail(email: string) {
      return users.find((u) => u.email === email) || null;
    },
    getUserById(id: number) {
      return users.find((u) => u.id === id) || null;
    },
    createLeaderboardEntry(data: { nickname: string; score: number; userId?: number | null }) {
      const entry: LeaderboardEntryRecord = {
        id: leaderboardIdCounter++,
        nickname: data.nickname.slice(0, 32),
        score: Math.floor(data.score),
        userId: data.userId ?? null,
        createdAt: new Date(),
      };
      leaderboard.push(entry);
      return entry;
    },
    listLeaderboard(limit: number) {
      return [...leaderboard]
        .sort((a, b) => b.score - a.score || a.createdAt.getTime() - b.createdAt.getTime())
        .slice(0, limit);
    },
  };
})();

// Uniwersalne API
export const repo = {
  isMemory: useMemory,
  async createUser(data: { email: string; passwordHash: string; nickname?: string | null; role?: "USER" | "ADMIN" }) {
    if (useMemory) {
      return memory.createUser(data);
    }
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        nickname: data.nickname ?? null,
        role: data.role ?? "USER",
      },
    }) as any;
  },
  async findUserByEmail(email: string) {
    if (useMemory) return memory.findUserByEmail(email);
    return prisma.user.findUnique({ where: { email } }) as any;
  },
  async getUserById(id: number) {
    if (useMemory) return memory.getUserById(id);
    return prisma.user.findUnique({ where: { id } }) as any;
  },
  async createLeaderboardEntry(data: { nickname: string; score: number; userId?: number | null }) {
    if (useMemory) return memory.createLeaderboardEntry(data);
    return prisma.leaderboardEntry.create({
      data: {
        nickname: data.nickname.slice(0, 32),
        score: Math.floor(data.score),
        userId: data.userId ?? undefined,
      },
    }) as any;
  },
  async listLeaderboard(limit: number) {
    if (useMemory) return memory.listLeaderboard(limit);
    return prisma.leaderboardEntry.findMany({
      orderBy: { score: "desc" },
      take: limit,
      include: { user: { select: { id: true, email: true } } },
    }) as any;
  },
};

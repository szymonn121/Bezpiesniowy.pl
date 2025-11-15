import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

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

const useMemory = process.env.USE_MEMORY_STORE === "true";

// Leaderboard backup (JSON) – simple durability across restarts
const leaderboardBackupPath = path.join(process.cwd(), "data", "leaderboard-backup.json");
let leaderboardRestoreAttempted = false;

type BackupEntry = { nickname: string; score: number; userId?: number | null; createdAt?: string };

async function readLeaderboardBackup(): Promise<BackupEntry[]> {
  try {
    const raw = await fs.readFile(leaderboardBackupPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function appendLeaderboardBackup(entry: { nickname: string; score: number; userId?: number | null; createdAt: Date }) {
  try {
    await fs.mkdir(path.dirname(leaderboardBackupPath), { recursive: true });
    const current = await readLeaderboardBackup();
    current.push({
      nickname: entry.nickname,
      score: entry.score,
      userId: entry.userId ?? null,
      createdAt: entry.createdAt.toISOString(),
    });
    await fs.writeFile(leaderboardBackupPath, JSON.stringify(current, null, 2), "utf-8");
  } catch {
    // best-effort; ignore backup write errors
  }
}

async function ensureLeaderboardRestore() {
  if (leaderboardRestoreAttempted) return;
  leaderboardRestoreAttempted = true;
  const backup = await readLeaderboardBackup();
  if (!backup.length) return;

  try {
    if (useMemory) {
      for (const e of backup) {
        memory.createLeaderboardEntry({ nickname: e.nickname, score: e.score, userId: e.userId ?? null });
      }
      return;
    }
    const existingAny = (await prisma.leaderboardEntry.findMany({ take: 1 })) as any[];
    if (!existingAny || existingAny.length === 0) {
      for (const e of backup) {
        await prisma.leaderboardEntry
          .create({
            data: {
              nickname: e.nickname.slice(0, 32),
              score: Math.floor(e.score),
              userId: e.userId ?? undefined,
            },
          })
          .catch(() => {});
      }
    }
  } catch {
    // ignore restore errors
  }
}

const memory = (() => {
  let userIdCounter = 1;
  let leaderboardIdCounter = 1;
  const users: UserRecord[] = [];
  const leaderboard: LeaderboardEntryRecord[] = [];
  return {
    createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt">) {
      const now = new Date();
      const user: UserRecord = {
        id: userIdCounter++,
        email: data.email,
        passwordHash: data.passwordHash,
        nickname: data.nickname ?? null,
        role: data.role,
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
    const userRecord = {
      email: data.email,
      passwordHash: data.passwordHash,
      nickname: data.nickname ?? null,
      role: data.role ?? "USER" as "USER" | "ADMIN",
    };
    if (useMemory) {
      return memory.createUser(userRecord);
    }
    return prisma.user.create({
      data: userRecord,
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
    await ensureLeaderboardRestore();
    if (useMemory) {
      const entry = memory.createLeaderboardEntry(data);
      await appendLeaderboardBackup(entry);
      return entry as any;
    }
    const entry = await prisma.leaderboardEntry.create({
      data: {
        nickname: data.nickname.slice(0, 32),
        score: Math.floor(data.score),
        userId: data.userId ?? undefined,
      },
    });
    await appendLeaderboardBackup({
      nickname: entry.nickname,
      score: entry.score,
      userId: (entry as any).userId ?? null,
      createdAt: (entry as any).createdAt ?? new Date(),
    });
    return entry as any;
  },
  async listLeaderboard(limit: number) {
    await ensureLeaderboardRestore();
    if (useMemory) return memory.listLeaderboard(limit);
    return prisma.leaderboardEntry.findMany({
      orderBy: { score: "desc" },
      take: limit,
      include: { user: { select: { id: true, email: true } } },
    }) as any;
  },
};

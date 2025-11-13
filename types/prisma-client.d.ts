declare module "@prisma/client" {
  export type UserRole = "USER" | "ADMIN";

  export interface User {
    id: number;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Song {
    id: number;
    title: string;
    artist: string;
    album?: string | null;
    year?: number | null;
    genre?: string | null;
    durationSeconds?: number | null;
    fileName: string;
    coverImage?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface GuessSession {
    id: number;
    userId?: number | null;
    songId: number;
    isCorrect: boolean;
    attempts: number;
    score: number;
    createdAt: Date;
  }

  export interface PrismaClientOptions {
    log?: any;
  }

  export class PrismaClient {
    constructor(options?: PrismaClientOptions);
    $disconnect(): Promise<void>;
    user: {
      findUnique: (...args: any[]) => Promise<User | null>;
      create: (...args: any[]) => Promise<User>;
      upsert: (...args: any[]) => Promise<User>;
    };
    song: {
      findMany: (...args: any[]) => Promise<Song[]>;
      findUnique: (...args: any[]) => Promise<Song | null>;
      findFirst: (...args: any[]) => Promise<Song | null>;
      create: (...args: any[]) => Promise<Song>;
      count: (...args: any[]) => Promise<number>;
      delete: (...args: any[]) => Promise<any>;
      deleteMany: (...args: any[]) => Promise<any>;
      upsert?: (...args: any[]) => Promise<Song>;
    };
    guessSession: {
      create: (...args: any[]) => Promise<GuessSession>;
      deleteMany: (...args: any[]) => Promise<any>;
    };
    [key: string]: any;
  }

  export const prismaVersion: string;
}

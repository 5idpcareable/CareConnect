import { promises as fs } from "fs";
import path from "path";

export type UserRole = "carer" | "admin" | "employer";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  postcode: string;
  passwordHash: string;
  roles: UserRole[];
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  createdAt: string;
};

type Database = {
  users: User[];
  sessions: Session[];
};

const dbPath = path.join(process.cwd(), "data", "careable-db.json");

async function readDb(): Promise<Database> {
  const file = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(file);
}

async function writeDb(db: Database) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export async function findUserById(id: string) {
  const db = await readDb();
  return db.users.find((user) => user.id === id);
}

export async function createUser(user: User) {
  const db = await readDb();

  db.users.push(user);

  await writeDb(db);

  return user;
}

export async function createSession(userId: string) {
  const db = await readDb();

  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };

  db.sessions.push(session);

  await writeDb(db);

  return session;
}

export async function findSession(sessionId: string) {
  const db = await readDb();
  return db.sessions.find((session) => session.id === sessionId);
}

export async function deleteSession(sessionId: string) {
  const db = await readDb();

  db.sessions = db.sessions.filter((session) => session.id !== sessionId);

  await writeDb(db);
}

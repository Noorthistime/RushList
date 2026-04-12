// ============================================================
// JSON file-based database with file locking for concurrency
// ============================================================

import fs from "fs";
import path from "path";
import lockfile from "proper-lockfile";

const DATA_DIR = path.join(process.cwd(), "data");

const DEFAULT_USERS = JSON.stringify({ users: [] }, null, 2);
const DEFAULT_TODOS = JSON.stringify({ todos: [] }, null, 2);

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureFile(filePath: string, defaultContent: string) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf-8");
  }
}

function getFilePath(fileName: string): string {
  return path.join(DATA_DIR, fileName);
}

/**
 * Read and parse a JSON file with type safety
 */
export async function readJSON<T>(fileName: string): Promise<T> {
  const filePath = getFilePath(fileName);
  const defaultContent = fileName === "users.json" ? DEFAULT_USERS : DEFAULT_TODOS;
  ensureFile(filePath, defaultContent);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    // If file is corrupted, reset it
    fs.writeFileSync(filePath, defaultContent, "utf-8");
    return JSON.parse(defaultContent) as T;
  }
}

/**
 * Write data to a JSON file with file locking for concurrency safety
 */
export async function writeJSON<T>(fileName: string, data: T): Promise<void> {
  const filePath = getFilePath(fileName);
  const defaultContent = fileName === "users.json" ? DEFAULT_USERS : DEFAULT_TODOS;
  ensureFile(filePath, defaultContent);

  let release: (() => Promise<void>) | null = null;

  try {
    // Acquire lock with retries
    release = await lockfile.lock(filePath, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
        factor: 2,
      },
      stale: 10000, // Consider lock stale after 10s
    });

    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, "utf-8");
  } finally {
    if (release) {
      await release();
    }
  }
}

/**
 * Perform a read-modify-write operation atomically
 */
export async function updateJSON<T>(
  fileName: string,
  updater: (data: T) => T
): Promise<T> {
  const filePath = getFilePath(fileName);
  const defaultContent = fileName === "users.json" ? DEFAULT_USERS : DEFAULT_TODOS;
  ensureFile(filePath, defaultContent);

  let release: (() => Promise<void>) | null = null;

  try {
    release = await lockfile.lock(filePath, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
        factor: 2,
      },
      stale: 10000,
    });

    const raw = fs.readFileSync(filePath, "utf-8");
    const current = JSON.parse(raw) as T;
    const updated = updater(current);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } finally {
    if (release) {
      await release();
    }
  }
}

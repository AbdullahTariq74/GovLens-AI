import { PrismaClient } from "@prisma/client";

export async function checkConnection(name: string, url: string | undefined): Promise<boolean> {
  if (!url) {
    console.log(`${name}: FAIL — env var not set`);
    return false;
  }

  const client = new PrismaClient({ datasourceUrl: url });
  try {
    await client.$queryRaw`SELECT 1`;
    console.log(`${name}: OK`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${name}: FAIL — ${message}`);
    return false;
  } finally {
    try {
      await client.$disconnect();
    } catch {
      // Disconnect failures don't change the pass/fail result already determined above.
    }
  }
}

async function main() {
  const results = await Promise.all([
    checkConnection("DATABASE_URL", process.env.DATABASE_URL),
    checkConnection("DIRECT_URL", process.env.DIRECT_URL),
  ]);

  const allPassed = results.every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

// Only run main() when executed directly (tsx src/check-connection.ts), not when imported by tests.
if (process.argv[1] && process.argv[1].endsWith("check-connection.ts")) {
  main();
}

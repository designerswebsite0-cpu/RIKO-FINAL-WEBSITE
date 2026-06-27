import { firebaseConfigurationPresent } from "@/lib/firebase";
import { storageConfigurationPresent } from "@/lib/storage";
import { databaseHealth } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const database = await databaseHealth();
    return Response.json({ success: true, ...database, storageConfigured: storageConfigurationPresent() });
  } catch (error) {
    return Response.json({ success: false, databaseConfigured: firebaseConfigurationPresent(), error: error instanceof Error ? error.message : "Health check failed." }, { status: 503 });
  }
}

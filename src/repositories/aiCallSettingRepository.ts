import { getDatabase } from "@/config/database";

export type CallMode = "live" | "test";

const getAiCallSettingsCollection = () => {
  const db = getDatabase();
  return db.collection("ai_call_settings");
};

export const getCallMode = async (sessionId: string): Promise<CallMode> => {
  try {
    const collection = getAiCallSettingsCollection();

    const setting = await collection.findOne({ session_id: sessionId });

    return setting?.call_mode || "test";
  } catch (error) {
    console.error(`[getCallMode] Error:`, error);
    return "test";
  }
};

export const setCallMode = async ({
  sessionId,
  mode,
}: {
  sessionId: string;
  mode: CallMode;
}) => {
  try {
    const collection = getAiCallSettingsCollection();

    await collection.updateOne(
      { session_id: sessionId },
      {
        $set: {
          call_mode: mode,
          updated_at: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`[setCallMode] Error:`, error);
    throw new Error(`Failed to set call mode for session: ${sessionId}`);
  }
};

import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  modeToDb,
  dbToMode,
  toDbMode,
  toAppMode,
  saveProgress,
  getModuleProgress,
  saveAttempt,
  getAttemptHistory,
} from "@/services/progressService";
import * as supabaseLib from "@/lib/supabase";

describe("progressService mode conversions", () => {
  it("maps frontend guide/practice to DB check constraint guided/independent", () => {
    expect(modeToDb("guide")).toBe("guided");
    expect(modeToDb("practice")).toBe("independent");
    expect(dbToMode("guided")).toBe("guide");
    expect(dbToMode("independent")).toBe("practice");
  });

  it("supports aliases toDbMode and toAppMode", () => {
    expect(toDbMode("guide")).toBe("guided");
    expect(toDbMode("guided")).toBe("guided");
    expect(toDbMode("practice")).toBe("independent");
    expect(toDbMode("independent")).toBe("independent");

    expect(toAppMode("guided")).toBe("guide");
    expect(toAppMode("guide")).toBe("guide");
    expect(toAppMode("independent")).toBe("practice");
  });
});

describe("progressService with mocked Supabase client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles guest auth failure gracefully without throwing", async () => {
    vi.spyOn(supabaseLib, "getOrCreateGuestSession").mockResolvedValue(null);

    const progressResult = await saveProgress({
      moduleId: "send-money",
      lastStep: 1,
      mode: "guide",
    });

    expect(progressResult.success).toBe(false);
    expect(progressResult.error).toContain("No guest session available");

    const getProgress = await getModuleProgress("send-money");
    expect(getProgress).toBeNull();

    const attemptResult = await saveAttempt({
      moduleId: "send-money",
      mode: "practice",
      completed: true,
      mistakesCount: 0,
      hintsUsed: 0,
    });
    expect(attemptResult.success).toBe(false);

    const history = await getAttemptHistory("send-money");
    expect(history).toEqual([]);
  });
});

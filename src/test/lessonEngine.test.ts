import { describe, expect, it } from "vitest";
import { initialEngineState, lessonReducer } from "@/hooks/useLessonEngine";
import { getModule } from "@/data/modules";

const steps = getModule("send-money")!.steps;
const reduce = lessonReducer(steps);

describe("lesson engine", () => {
  it("advances only when the expected action is performed", () => {
    const s = reduce(initialEngineState, { type: "ACT", action: "send-money" });
    expect(s.stepIndex).toBe(1);
    expect(s.mistakes).toBe(0);
  });

  it("records a mistake with contextual feedback for a wrong action", () => {
    const s = reduce(initialEngineState, { type: "ACT", action: "history" });
    expect(s.stepIndex).toBe(0);
    expect(s.mistakes).toBe(1);
    expect(s.feedback?.en).toMatch(/Send Money/);
  });

  it("counts a hint once per step", () => {
    let s = reduce(initialEngineState, { type: "HINT" });
    s = reduce(s, { type: "HINT" });
    expect(s.hints).toBe(1);
  });

  it("lets the learner go back to edit without a penalty", () => {
    let s = initialEngineState;
    for (const a of ["send-money", "wallet-to-wallet", "recipient-continue", "amount-continue"]) s = reduce(s, { type: "ACT", action: a });
    s = reduce(s, { type: "GOTO", stepId: "recipient" });
    expect(steps[s.stepIndex].id).toBe("recipient");
    expect(s.mistakes).toBe(0);
  });
});

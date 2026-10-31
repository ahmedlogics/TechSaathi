import { describe, expect, it } from "vitest";
import { toAppMode, toDbMode } from "@/services/progressService";

describe("progressService mode conversions", () => {
  it("correctly maps frontend mode 'guide' to database mode 'guided'", () => {
    expect(toDbMode("guide")).toBe("guided");
    expect(toDbMode("guided")).toBe("guided");
  });

  it("correctly maps frontend mode 'practice' to database mode 'independent'", () => {
    expect(toDbMode("practice")).toBe("independent");
    expect(toDbMode("independent")).toBe("independent");
  });

  it("correctly maps database mode 'guided' back to 'guide'", () => {
    expect(toAppMode("guided")).toBe("guide");
    expect(toAppMode("guide")).toBe("guide");
  });

  it("correctly maps database mode 'independent' back to 'practice'", () => {
    expect(toAppMode("independent")).toBe("practice");
  });
});


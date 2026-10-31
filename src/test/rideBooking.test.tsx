import { describe, expect, it } from "vitest";
import { getModule } from "@/data/modules";
import { lessonReducer, initialEngineState } from "@/hooks/useLessonEngine";
import {
  CURATED_LOCATIONS,
  searchPlaces,
  reverseGeocode,
  getBrowserCurrentLocation,
} from "@/lib/rideGeocoding";

const rideModule = getModule("book-ride")!;
const reduce = lessonReducer(rideModule.steps);

describe("Ride Booking module flow", () => {
  it("progresses through all 7 guided lesson steps seamlessly", () => {
    let s = initialEngineState;

    // Step 1: where-to (Start screen -> Enter your route)
    s = reduce(s, { type: "ACT", action: "where-to" });
    expect(s.stepIndex).toBe(1);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("pickup");

    // Step 2: pickup-continue
    s = reduce(s, { type: "ACT", action: "pickup-continue" });
    expect(s.stepIndex).toBe(2);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("destination");

    // Step 3: dest-continue
    s = reduce(s, { type: "ACT", action: "dest-continue" });
    expect(s.stepIndex).toBe(3);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("ride");

    // Step 4: ride-continue
    s = reduce(s, { type: "ACT", action: "ride-continue" });
    expect(s.stepIndex).toBe(4);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("review");

    // Step 5: confirm-booking
    s = reduce(s, { type: "ACT", action: "confirm-booking" });
    expect(s.stepIndex).toBe(5);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("assigned");

    // Step 6: see-vehicle
    s = reduce(s, { type: "ACT", action: "see-vehicle" });
    expect(s.stepIndex).toBe(6);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("verify");

    // Step 7: plate-different
    s = reduce(s, { type: "ACT", action: "plate-different" });
    expect(s.stepIndex).toBe(7);
    expect(rideModule.steps[s.stepIndex]?.id).toBe("done");
  });

  it("searches places with debounced query and min 3 chars", async () => {
    const emptyResults = await searchPlaces("ne");
    expect(emptyResults).toEqual([]);

    const results = await searchPlaces("NED");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes("NED"))).toBe(true);
  });

  it("reverse geocodes coordinates to a recognizable address", async () => {
    const geo = await reverseGeocode(24.9328, 67.113);
    expect(geo.name).toBe("NED Visitor Gate");
    expect(geo.address).toContain("Karachi");
  });

  it("handles browser geolocation request gracefully", async () => {
    const originalGeo = navigator.geolocation;
    // @ts-ignore
    delete window.navigator.geolocation;

    await expect(getBrowserCurrentLocation()).rejects.toThrow();

    Object.defineProperty(window.navigator, "geolocation", {
      value: originalGeo,
      configurable: true,
      writable: true,
    });
  });

  it("provides accurate curated locations for Karachi", () => {
    expect(CURATED_LOCATIONS.length).toBeGreaterThanOrEqual(4);
    const gate = CURATED_LOCATIONS.find((l) => l.name === "NED Visitor Gate");
    expect(gate).toBeDefined();
    expect(gate?.distance).toBe("2.5 km");
    const ned = CURATED_LOCATIONS.find((l) => l.name.includes("Engineering"));
    expect(ned).toBeDefined();
    expect(ned?.distance).toBe("2.8 km");
    const hospital = CURATED_LOCATIONS.find((l) => l.name.includes("POB"));
    expect(hospital).toBeDefined();
    expect(hospital?.distance).toBe("600 m");
  });
});

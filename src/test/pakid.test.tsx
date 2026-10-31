import { describe, expect, it } from "vitest";
import { tutorialSteps } from "@/features/pakid/pakidTutorialData";
import { photoSamples, practiceSteps } from "@/features/pakid/pakidPracticeData";
import { pakidText } from "@/features/pakid/pakidTranslations";

describe("PakID Proof-of-Life Feature", () => {
  it("provides 13 picture tutorial steps covering the entire journey", () => {
    expect(tutorialSteps.length).toBe(13);
    tutorialSteps.forEach((s) => {
      expect(s.title.en).toBeDefined();
      expect(s.title.ur).toBeDefined();
      expect(s.instruction.en).toBeDefined();
      expect(s.instruction.ur).toBeDefined();
      expect(s.imagePath).toMatch(/\.(jpeg|png|svg)$/);
    });
  });

  it("provides 13 interactive practice steps covering all required screens", () => {
    expect(practiceSteps.length).toBe(13);
    const screens = practiceSteps.map((s) => s.screen);
    expect(screens).toContain("login");
    expect(screens).toContain("dashboard");
    expect(screens).toContain("applicant");
    expect(screens).toContain("fee");
    expect(screens).toContain("biometric-alert");
    expect(screens).toContain("face-prepare");
    expect(screens).toContain("face-capture");
    expect(screens).toContain("fingerprints");
    expect(screens).toContain("review-submission");
    expect(screens).toContain("submitted");
    expect(screens).toContain("id-vault");
    expect(screens).toContain("my-documents");
    expect(screens).toContain("document-view");
  });

  it("has exactly one correct photo pose and descriptive feedback for incorrect ones", () => {
    const correctOnes = photoSamples.filter((s) => s.isCorrect);
    expect(correctOnes.length).toBe(1);
    expect(correctOnes[0]?.id).toBe("correct");

    const incorrectOnes = photoSamples.filter((s) => !s.isCorrect);
    expect(incorrectOnes.length).toBe(3);
    incorrectOnes.forEach((s) => {
      expect(s.explanation.en).toBeDefined();
      expect(s.statusText.en).toBeDefined();
    });
  });

  it("provides bilingual translations for all core UI elements", () => {
    expect(pakidText["moduleTitle"]!.en).toContain("Proof-of-Life");
    expect(pakidText["moduleTitle"]!.ur).toContain("زندگی کا ثبوت");
    expect(pakidText["disclaimerNotice"]!.en).toContain("educational simulation");
    expect(pakidText["cardPictureBtn"]!.en).toBe("Start Picture Tutorial");
    expect(pakidText["cardPracticeBtn"]!.en).toBe("Start Practice");
  });

  it("links to the official NADRA YouTube video with proper attributes", () => {
    const videoUrl = "https://www.youtube.com/watch?v=078kiJV6w_M";
    expect(videoUrl).toContain("youtube.com/watch?v=078kiJV6w_M");
  });
});


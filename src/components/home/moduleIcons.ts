import { Car, IdCard, Video, Wallet, type LucideIcon } from "lucide-react";
import type { ModuleId } from "@/types/learning";

export const moduleVisual: Record<ModuleId, { icon: LucideIcon; tone: string }> = {
  "send-money": { icon: Wallet, tone: "bg-mint text-primary-strong" },
  "book-ride": { icon: Car, tone: "bg-sky text-heading" },
  "proof-of-life": { icon: IdCard, tone: "bg-warning-soft text-warning" },
  "video-call": { icon: Video, tone: "bg-success-soft text-success" },
};

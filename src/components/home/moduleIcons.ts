import { Car, Video, Wallet, type LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { ModuleId } from "@/types/learning";
import { NadraLogo } from "@/components/icons/NadraLogo";

export const moduleVisual: Record<
  ModuleId,
  { icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>; tone: string }
> = {
  "send-money": { icon: Wallet, tone: "bg-mint text-primary-strong" },
  "book-ride": { icon: Car, tone: "bg-sky text-heading" },
  "proof-of-life": { icon: NadraLogo, tone: "bg-emerald-900 text-white shadow-sm" },
  "video-call": { icon: Video, tone: "bg-success-soft text-success" },
};

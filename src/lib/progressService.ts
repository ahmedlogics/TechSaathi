export * from "@/services/progressService";

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

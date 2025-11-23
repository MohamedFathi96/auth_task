export function extractValidationErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return String(error);
}

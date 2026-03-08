export function validateNodeTitle(title: string): void {
  if (title.trim().length === 0) {
    throw new Error("Node title cannot be empty");
  }
  if (title.length > 255) {
    throw new Error("Node title cannot exceed 255 characters");
  }
}

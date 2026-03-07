export function validateItemTitle(title: string): void {
  if (!title || title.trim().length === 0) {
    throw new Error("Item title is required");
  }
  if (title.length > 255) {
    throw new Error("Item title must be 255 characters or fewer");
  }
}

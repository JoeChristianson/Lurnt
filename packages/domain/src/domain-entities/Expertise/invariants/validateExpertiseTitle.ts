export function validateExpertiseTitle(title: string): void {
  if (title.trim().length === 0) {
    throw new Error("Expertise title cannot be empty");
  }
  if (title.length > 255) {
    throw new Error("Expertise title cannot exceed 255 characters");
  }
}

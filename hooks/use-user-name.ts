import { useState, useEffect } from "react";

/**
 * Reads the signed-in user's name from localStorage.
 * Returns "Student" on SSR and as fallback when no user is stored.
 * Both server and client start at "Student" to avoid hydration mismatch.
 */
export function useUserName(): string {
  const [name, setName] = useState("Student");

  useEffect(() => {
    const stored = localStorage.getItem("user_name");
    if (stored) setName(stored);
  }, []);

  return name;
}

/** "Alex Rivera" → "AR" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

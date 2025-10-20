import { cookies } from "next/headers";

/**
 * Reads the "theme" cookie (if it exists) and returns "light" or "dark".
 * Defaults to "light" for SSR consistency.
 */
export async function getInitialTheme(): Promise<"light" | "dark"> {
  const cookieStore = await cookies();
  const c = cookieStore.get("theme")?.value;
  return c === "dark" || c === "light" ? c : "light";
}

export async function requireAuth(_req: Request) {
  return { id: "user_1", role: "admin" };
}

export function requireRole(user: { role: string }, role: string) {
  if (user.role !== role) throw new Error("forbidden");
}

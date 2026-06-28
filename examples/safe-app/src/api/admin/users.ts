import { requireAuth, requireRole } from "../../lib/auth";

export async function getUsers(req: Request) {
  const user = await requireAuth(req);
  requireRole(user, "admin");
  return Response.json([]);
}

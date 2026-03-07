import { authenticateAdmin, unauthorized } from "@lurnt/api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!authenticateAdmin(req)) return unauthorized();

  return Response.json({ ok: true });
}

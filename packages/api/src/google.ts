import { OAuth2Client } from "google-auth-library";

let _client: OAuth2Client | null = null;

function getClient() {
  if (!_client) {
    _client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return _client;
}

export async function verifyGoogleToken(idToken: string) {
  const ticket = await getClient().verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google token");
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
    picture: payload.picture ?? null,
  };
}

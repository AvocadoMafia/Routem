const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const fallbackAuthRedirectUrl = "http://localhost:3000/auth/callback";

export default function getClientMapboxAccessToken() {
  return mapboxAccessToken;
}

export function getClientAuthRedirectUrl(): string {
  return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ?? fallbackAuthRedirectUrl;
}

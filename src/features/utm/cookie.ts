const EXPIRES_DAYS = 730; // 2년

export function getExpires(days = EXPIRES_DAYS): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}

export function getCookie(key: string): string | null {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`));
  return cookie ? cookie.trim().slice(key.length + 1) : null;
}

export function setCookie(name: string, value: string, expires = getExpires()): void {
  document.cookie = `${name}=${value || ""}; expires=${expires.toUTCString()}; path=/`;
}

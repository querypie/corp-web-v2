export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export function isLocalAdminHost(hostname: string) {
  const normalizedHostname = hostname.toLowerCase();

  return (
    normalizedHostname === "localhost" ||
    normalizedHostname === "::1" ||
    normalizedHostname === "0.0.0.0" ||
    normalizedHostname.startsWith("127.")
  );
}

export function shouldBlockAdminAccess(pathname: string, hostname: string) {
  return isAdminPath(pathname) && !isLocalAdminHost(hostname);
}

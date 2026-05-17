export function hasAdminPassword() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isValidAdminBasicAuth(authorization: string | null) {
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "owner";

  if (!password) {
    return true;
  }

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const encoded = authorization.slice("Basic ".length);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const suppliedUsername = decoded.slice(0, separatorIndex);
  const suppliedPassword = decoded.slice(separatorIndex + 1);

  return suppliedUsername === username && suppliedPassword === password;
}

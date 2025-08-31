export function transformMobileUrl(
  linkUrl: string,
  os: "ios" | "android" | undefined
) {
  if (os === "ios") {
    const url = new URL(linkUrl);

    if (
      url.hostname === "docs.google.com" &&
      url.pathname.startsWith("/spreadsheets/")
    ) {
      return linkUrl.replace(/^https:/, "googlesheets:");
    }

    return `x-safari-${url}`;
  }

  return linkUrl;
}

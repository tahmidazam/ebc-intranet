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

    if (url.hostname === "www.instagram.com") {
      return linkUrl.replace(
        "https://www.instagram.com/",
        "instagram://user?username="
      );
    }

    return `x-safari-${url}`;
  }

  return linkUrl;
}

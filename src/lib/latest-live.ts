import { Dom } from "native-dom";

export function ytJson(html: string) {
  const $ = Dom.dom(html);
  const content = $.walk(
    (node) => node.tag() == "script" && node.text().includes("ytInitialData"),
  )[0].text();
  const json = JSON.parse(content.substring("var ytInitialData = ".length, content.length - 1));
  return json;
}

export interface ChannelVideo {
  id: string;
  title: string;
  description: string;
  at: string;
  length: string;
  views: string;
  viewsShort: string;
  thumbnail: string;
  url: string;
  isLive: boolean;
}

const WATCHING = /watching|視聴中/i;

// YouTube now renders channel grid items as `lockupViewModel` instead of `videoRenderer`.
function lockupToVideo(lockup: any): ChannelVideo | null {
  const id = lockup.contentId;
  if (!id) return null;

  const metadata = lockup.metadata?.lockupMetadataViewModel;

  // e.g. ["7 views", "Streamed 2 days ago"] for a VOD, ["7.7K watching"] while live.
  const parts: string[] =
    metadata?.metadata?.contentMetadataViewModel?.metadataRows
      ?.flatMap((row: any) => row.metadataParts ?? [])
      ?.map((part: any) => part.text?.content ?? "")
      ?.filter(Boolean) ?? [];

  const badges =
    lockup.contentImage?.thumbnailViewModel?.overlays?.flatMap(
      (overlay: any) => overlay.thumbnailBottomOverlayViewModel?.badges ?? [],
    ) ?? [];
  const badgeStyle = (badge: any) => badge.thumbnailBadgeViewModel?.badgeStyle ?? "";

  const isLive =
    badges.some((badge: any) => badgeStyle(badge) === "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE") ||
    parts.some((part) => WATCHING.test(part));

  // The duration badge is replaced by a "LIVE" badge while streaming.
  const views = parts[0] ?? "";
  const length = isLive
    ? ""
    : (badges.find((badge: any) => badgeStyle(badge) === "THUMBNAIL_OVERLAY_BADGE_STYLE_DEFAULT")
        ?.thumbnailBadgeViewModel?.text ?? "");

  return {
    id,
    title: metadata?.title?.content ?? "",
    // No longer exposed by the lockup markup.
    description: "",
    at: isLive ? "" : (parts[1] ?? ""),
    length,
    views,
    viewsShort: views,
    thumbnail: lockup.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url ?? "",
    url: `https://www.youtube.com/watch?v=${id}`,
    isLive,
  };
}

// Fallback for the older markup, in case YouTube serves it again.
function videoRendererToVideo(renderer: any): ChannelVideo | null {
  const id = renderer.videoId;
  if (!id) return null;

  const isLive =
    renderer.badges?.some((badge: any) => {
      const label = badge.metadataBadgeRenderer?.label?.toLowerCase() || "";
      const style = badge.metadataBadgeRenderer?.style || "";
      return label.includes("live") || label.includes("配信中") || style.includes("LIVE");
    }) ||
    renderer.thumbnailOverlays?.some(
      (overlay: any) => overlay.thumbnailOverlayTimeStatusRenderer?.style === "LIVE",
    ) ||
    WATCHING.test(
      renderer.viewCountText?.simpleText ?? renderer.viewCountText?.runs?.[0]?.text ?? "",
    ) ||
    false;

  return {
    id,
    title: renderer.title?.runs?.[0]?.text ?? "",
    description: renderer.descriptionSnippet?.runs?.[0]?.text ?? "",
    at: renderer.publishedTimeText?.runs?.[0]?.text ?? "",
    length: renderer.lengthText?.simpleText ?? "",
    views: renderer.viewCountText?.simpleText ?? "",
    viewsShort: renderer.viewCountText?.runs?.[0]?.text ?? "",
    thumbnail: renderer.thumbnail?.thumbnails?.[0]?.url ?? "",
    url: `https://www.youtube.com/watch?v=${id}`,
    isLive,
  };
}

export function jsonChannelVideos(html: string): ChannelVideo[] {
  const data = ytJson(html);
  const videos: ChannelVideo[] = [];

  try {
    const tabs = data.contents.twoColumnBrowseResultsRenderer.tabs;
    const videosTab =
      tabs.find((tab: any) => tab.tabRenderer?.selected === true) ||
      tabs.find((tab: any) => tab.tabRenderer?.content?.richGridRenderer);
    const items = videosTab.tabRenderer.content.richGridRenderer.contents;

    for (const item of items) {
      const content = item.richItemRenderer?.content;
      if (!content) continue;

      const video = content.lockupViewModel
        ? lockupToVideo(content.lockupViewModel)
        : content.videoRenderer
          ? videoRendererToVideo(content.videoRenderer)
          : null;
      if (!video) continue;

      videos.push(video);
    }
  } catch (e) {
    console.error("Error parsing channel videos:", e);
    return [];
  }

  return videos;
}

export function channelToURL(channel: string) {
  if (channel.startsWith("@")) {
    channel = "@" + encodeURIComponent(channel.slice(1));
    return `https://www.youtube.com/${channel}`;
  } else {
    channel = encodeURIComponent(channel);
    return `https://www.youtube.com/channel/${channel}`;
  }
}

export async function channelLives(channel: string) {
  const res = await fetch(`${channelToURL(channel)}/streams`, {
    redirect: "follow",
  });
  return jsonChannelVideos(await res.text());
}

export async function channelVideos(channel: string) {
  const res = await fetch(`${channelToURL(channel)}/videos`, {
    redirect: "follow",
  });
  return jsonChannelVideos(await res.text());
}

export async function latestVideo(channel: string) {
  const videos = await channelVideos(channel);
  return videos[0];
}

export async function latestLive(channel: string) {
  const lives = await channelLives(channel);
  return lives[0];
}

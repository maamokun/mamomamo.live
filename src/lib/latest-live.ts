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

export function jsonChannelVideos(html: string): ChannelVideo[] {
  const data = ytJson(html);
  const videos: ChannelVideo[] = [];

  try {
    const tabs = data.contents.twoColumnBrowseResultsRenderer.tabs;
    const videosTab = tabs.find((tab: any) => tab.tabRenderer?.selected === true) || tabs[1];
    const gridRenderer = videosTab.tabRenderer.content.richGridRenderer;
    const items = gridRenderer.contents;

    for (const item of items) {
      const renderer = item.richItemRenderer?.content.videoRenderer;
      if (!renderer) continue;

      const isLive =
        renderer.badges?.some((badge: any) =>
          badge.metadataBadgeRenderer?.label?.toLowerCase()?.includes("live"),
        ) || false;

      const video: ChannelVideo = {
        id: renderer.videoId,
        title: renderer.title.runs?.[0]?.text || "",
        description: renderer.descriptionSnippet?.runs?.[0]?.text || "",
        at: renderer.publishedTimeText?.runs?.[0]?.text || "",
        length: renderer.lengthText?.simpleText || "",
        views: renderer.viewCountText?.simpleText || "",
        viewsShort: renderer.viewCountText?.runs?.[0]?.text || "",
        thumbnail: renderer.thumbnail?.thumbnails?.[0]?.url || "",
        url: `https://www.youtube.com/watch?v=${renderer.videoId}`,
        isLive,
      };

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

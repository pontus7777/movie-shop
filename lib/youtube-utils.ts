/**
 * Extracts the YouTube video ID from common URL formats and returns
 * an embeddable URL, or null if the input isn't a recognizable YouTube link.
 *
 * Supports:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - Any of the above with extra query params (e.g. &t=30s)
 */
export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    let videoId: string | null = null

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1)
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v')
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]
      }
    }

    if (!videoId) return null

    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return null
  }
}
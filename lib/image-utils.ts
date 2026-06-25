import placeHolder from "@/public/file.svg";

export function getMovieImageSrc(imageUrl: string | null) {
  if (!imageUrl) {
    return placeHolder.src;
  }

  if (imageUrl.startsWith("public/")) {
    return `/${imageUrl.replace("public/", "")}`;
  }
  
  if (!imageUrl.startsWith("/") && !imageUrl.startsWith("http")) {
    return `/${imageUrl}`;
  }

  return imageUrl;
}
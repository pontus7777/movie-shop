'use client'
import { Movie } from '@/generated/prisma/client'
import Image from 'next/image'
import { PlayCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
    movies: Movie[]
}

// Extracts the YouTube video ID from common URL formats
function getYoutubeEmbedUrl(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null
}

export function UserMovieLibrary({ movies }: Props) {
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null)

    if (movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <PlayCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">No movies yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Movies you`ve purchased will appear here.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Watch List</h1>
                        <p className="text-sm text-muted-foreground">
                            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} in your library
                        </p>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="group flex flex-col gap-2 rounded-lg overflow-hidden border hover:border-primary transition-colors"
                    >
                        <div className="relative aspect-2/3 bg-muted">
                            {movie.imageUrl && (
                                <Image
                                    src={movie.imageUrl}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                />
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100">
                                {movie.trailerUrl ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault() // stop the Link navigation
                                            e.stopPropagation()
                                            setTrailerUrl(movie.trailerUrl!)

                                        }}
                                        className="flex h-10 w-10 items-center justify-center"
                                        aria-label={`Watch trailer for ${movie.title}`}
                                    >
                                        <PlayCircle className="h-10 w-10 text-white drop-shadow-md hover:scale-110 transition-transform" />
                                    </button>
                                ) : (
                                    <PlayCircle className="h-10 w-10 text-white drop-shadow-md" />
                                )}
                            </div>

                        </div>

                        <p className="px-2 pb-2 text-sm font-medium truncate">{movie.title}</p>
                    </Link>
                ))}
            </div>

            {/* Trailer modal */}
            {trailerUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setTrailerUrl(null)}
                >
                    <div
                        className="relative w-full max-w-3xl aspect-video"
                        onClick={(e) => e.stopPropagation()} // prevent overlay click from closing when clicking the video itself
                    >
                        <button
                            onClick={() => setTrailerUrl(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                            aria-label="Close trailer"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {getYoutubeEmbedUrl(trailerUrl) ? (
                            <iframe
                                src={getYoutubeEmbedUrl(trailerUrl)!}
                                className="h-full w-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video src={trailerUrl} controls autoPlay className="h-full w-full rounded-lg" />
                        )}
                    </div>
                </div>
            )}

        </>
    )
}
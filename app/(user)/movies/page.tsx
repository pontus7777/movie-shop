'use client'

import { useState } from 'react'

import MovieCard from '@/components/moviecard'

import { MoviesPagination } from './_components/movies-pagination'

const movies = [
  {
    id: 1,
    title: 'Neon Horizon',
    description: 'A cyberpunk detective uncovers a conspiracy that spans galaxies.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 18,
  },
  {
    id: 2,
    title: 'Ashes of Tomorrow',
    description: 'Survivors navigate a ruined world after a global collapse.',
    genre: 'Post-Apocalyptic',
    imageUrl: 'https://picsum.photos/200/300',
    price: 22,
  },
  {
    id: 3,
    title: 'Crimson Vow',
    description: 'A royal assassin questions her loyalty after discovering a hidden truth.',
    genre: 'Action',
    imageUrl: 'https://picsum.photos/200/300',
    price: 20,
  },
  {
    id: 4,
    title: 'Silent Echoes',
    description: 'A musician begins hearing voices from another dimension.',
    genre: 'Thriller',
    imageUrl: 'https://picsum.photos/200/300',
    price: 17,
  },
  {
    id: 5,
    title: 'The Last Ember',
    description: 'A young mage must protect the final spark of magic.',
    genre: 'Fantasy',
    imageUrl: 'https://picsum.photos/200/300',
    price: 25,
  },
  {
    id: 6,
    title: 'Iron Wolves',
    description: 'An elite squad fights to stop a rogue military AI.',
    genre: 'Action',
    imageUrl: 'https://picsum.photos/200/300',
    price: 19,
  },
  {
    id: 7,
    title: 'Moonfall Protocol',
    description: 'Astronauts uncover a secret buried beneath the lunar surface.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 21,
  },
  {
    id: 8,
    title: 'Shattered Crown',
    description: 'A kingdom descends into chaos after the king mysteriously disappears.',
    genre: 'Drama',
    imageUrl: 'https://picsum.photos/200/300',
    price: 16,
  },
  {
    id: 9,
    title: 'Phantom Circuit',
    description: 'A hacker becomes trapped inside a virtual world he created.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 23,
  },
  {
    id: 10,
    title: 'Wildfire Run',
    description: 'A firefighter races against time to save a trapped family.',
    genre: 'Action',
    imageUrl: 'https://picsum.photos/200/300',
    price: 15,
  },
  {
    id: 11,
    title: 'Golden Mirage',
    description: 'Treasure hunters chase a mythical city hidden in the desert.',
    genre: 'Adventure',
    imageUrl: 'https://picsum.photos/200/300',
    price: 24,
  },
  {
    id: 12,
    title: 'Echo Valley',
    description: 'A small town hides a supernatural secret tied to its past.',
    genre: 'Mystery',
    imageUrl: 'https://picsum.photos/200/300',
    price: 18,
  },
  {
    id: 13,
    title: 'Frostbite',
    description: 'A research team in Antarctica faces a deadly unknown organism.',
    genre: 'Horror',
    imageUrl: 'https://picsum.photos/200/300',
    price: 20,
  },
  {
    id: 14,
    title: 'Violet Skies',
    description: 'Two strangers form a bond during a cosmic event.',
    genre: 'Romance',
    imageUrl: 'https://picsum.photos/200/300',
    price: 14,
  },
  {
    id: 15,
    title: 'Quantum Drift',
    description: 'A physicist becomes unstuck in time after an experiment fails.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 22,
  },
  {
    id: 16,
    title: 'Shadowbound',
    description: 'A cursed warrior seeks redemption in a world of darkness.',
    genre: 'Fantasy',
    imageUrl: 'https://picsum.photos/200/300',
    price: 26,
  },
  {
    id: 17,
    title: 'Nightfall City',
    description: 'A detective hunts a serial killer in a neon‑lit metropolis.',
    genre: 'Crime',
    imageUrl: 'https://picsum.photos/200/300',
    price: 19,
  },
  {
    id: 18,
    title: 'Solar Requiem',
    description: 'Humanity prepares for the sun’s unexpected collapse.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 23,
  },
  {
    id: 19,
    title: 'Broken Atlas',
    description: 'A cartographer discovers a map that predicts future disasters.',
    genre: 'Thriller',
    imageUrl: 'https://picsum.photos/200/300',
    price: 17,
  },
  {
    id: 20,
    title: 'Crimson Harbor',
    description: 'A detective uncovers corruption in a coastal city.',
    genre: 'Crime',
    imageUrl: 'https://picsum.photos/200/300',
    price: 16,
  },
  {
    id: 21,
    title: 'Starforge',
    description: 'A pilot joins a rebellion against a galactic empire.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 24,
  },
  {
    id: 22,
    title: 'Thunderstrike',
    description: 'A vigilante with electric powers fights a corrupt corporation.',
    genre: 'Action',
    imageUrl: 'https://picsum.photos/200/300',
    price: 20,
  },
  {
    id: 23,
    title: 'Emerald Tide',
    description: 'A marine biologist uncovers a secret beneath the ocean floor.',
    genre: 'Adventure',
    imageUrl: 'https://picsum.photos/200/300',
    price: 18,
  },
  {
    id: 24,
    title: 'The Last Sentinel',
    description: 'A lone guardian protects an ancient relic from invaders.',
    genre: 'Fantasy',
    imageUrl: 'https://picsum.photos/200/300',
    price: 25,
  },
  {
    id: 25,
    title: 'Digital Ghost',
    description: 'A programmer is haunted by an AI he tried to delete.',
    genre: 'Tech Thriller',
    imageUrl: 'https://picsum.photos/200/300',
    price: 21,
  },
  {
    id: 26,
    title: 'Skybreaker',
    description: 'A rogue pilot attempts the most dangerous heist in history.',
    genre: 'Action',
    imageUrl: 'https://picsum.photos/200/300',
    price: 19,
  },
  {
    id: 27,
    title: 'Whispering Pines',
    description: 'A family moves to a forest town with a dark past.',
    genre: 'Horror',
    imageUrl: 'https://picsum.photos/200/300',
    price: 17,
  },
  {
    id: 28,
    title: 'Nova Bloom',
    description: 'A botanist discovers a plant that can alter human memory.',
    genre: 'Sci-Fi',
    imageUrl: 'https://picsum.photos/200/300',
    price: 22,
  },
  {
    id: 29,
    title: 'Iron Kingdom',
    description: 'A blacksmith becomes a reluctant hero in a war‑torn realm.',
    genre: 'Fantasy',
    imageUrl: 'https://picsum.photos/200/300',
    price: 26,
  },
  {
    id: 30,
    title: 'Zero Hour',
    description: 'A bomb squad races against time to stop a citywide attack.',
    genre: 'Thriller',
    imageUrl: 'https://picsum.photos/200/300',
    price: 20,
  },
]

// This is currently being a client side pagination, can change it to server component with data in the db (Pontus)

export default function MoviesPage({}) {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const totalPages = Math.ceil(movies.length / pageSize)

  const paginatedMovies = movies.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="min-h-lvh space-y-6 p-6">
      <h1 className="text-3xl font-bold">Movies</h1>

      {/* Movie Grid */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
          {paginatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <MoviesPagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}

export const movieInclude = {
  genres: true,
  keywords: true,
  credits: {
    include: {
      crew: true,
    },
  },
}

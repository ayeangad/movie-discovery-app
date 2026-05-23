import noMovieImage from '../assets/no-movie.png'
import starRating from '../assets/star.svg'

const MovieCard = ({ movie: { title, poster_path, vote_average, release_date, original_language } }: any) => {
  return (
    <div className="movie-card">
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noMovieImage}
        className="w-full h-[350px] object-cover rounded-lg"
        alt={title}
      />

      <div className='mt-4'>
        <h3>{title}</h3>

        <div className='content'>
          <div className='rating'>
            <img src={starRating} alt='Star Icon' />
            <p> {vote_average ? vote_average.toFixed(1) : "N/A"} </p>

            <span>•</span>
            <p className='lang'>{original_language}</p>

            <span>•</span>
            <p className='year'>
              {release_date ? release_date.split('-')[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MovieCard


import Herobanner from '../../components/HeroBanner/Herobanner'
import './MovieDetails.css'
import Cast from '../../components/Cast/Cast'
import { useParams } from 'react-router-dom'


const MovieDetails = () => {
  const { movieId } = useParams()

  return (
    <div>
      <Herobanner />
      <Cast movieId={movieId} />
    </div>
  )
}

export default MovieDetails
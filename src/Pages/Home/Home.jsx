import './Home.css'
import Herobanner from '../../components/HeroBanner/Herobanner'
import Videocard from '../../components/VideoCard/Videocard'
import Category from '../Category/Category'
import { CATEGORY_SECTIONS } from "../../constants/constants";

const Home = ({ showSearch, searchQuery }) => {
  return (
    <div className='home-container'>
      {showSearch && searchQuery ? (
        <Category searchQuery={searchQuery} title={`Results for "${searchQuery}"`} />
      ) : (
        <>
          <Herobanner />
          <div id="movies-section">
            {CATEGORY_SECTIONS.map((section) => (
              <Videocard key={section.key} category={section.key} title={section.title} />
            ))}
          </div>
        </>

      )}
    </div>
  )
}

export default Home

import { useEffect, useState, useCallback, useRef } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import TrailerModal from "./components/TrailerModal"
import './app.scss'

const App = () => {
  const movies = useSelector(state => state.movies);
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  const isMounted = useRef(null)

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=1`))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}1`))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    window.scrollTo(0, 0)
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = useCallback(() => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${movies.page}`));
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${movies.page}`));
    }
  }, [dispatch, movies.page, searchQuery]);


  const viewTrailer = async (movie) => {
    await getMovie(movie.id)
    setOpen(true)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
  }

  const handleScrolling = useCallback( async() => {
      window.scrollBy(0, -100);
      getMovies()

    }, [getMovies])

  useEffect(() => {
    if(!isMounted.current){
      getMovies()
      isMounted.current = true
    }
  }, [getMovies])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />
      <div className="container">
        <TrailerModal isOpen={isOpen} setOpen={setOpen} videoKey={videoKey}/>
        <Routes>
          <Route path="/" element={<Movies onScroll={handleScrolling} movies={movies} viewTrailer={viewTrailer}/>} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App

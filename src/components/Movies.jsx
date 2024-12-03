import { useRef, useState, useEffect } from 'react'
import Movie from './Movie'
import '../styles/movies.scss'
import { useObserver } from '../hooks/useObserver'


const Movies = ({ movies, viewTrailer, onScroll }) => {
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const infinityScrollingRef = useRef(null)
    const isFetching =  movies.fetchStatus === 'loading'
    const isLoading = imagesLoaded === 0 || imagesLoaded < movies.movies?.result?.length || isFetching

    useObserver(infinityScrollingRef, onScroll, isLoading);

    useEffect(() => {
        setImagesLoaded(0);
    }, [movies.movies.results]);

    const handleImageLoad = () => {
        setImagesLoaded((prev) => prev + 1);
    };

    if(!movies.movies?.results?.length && !isFetching) {
        return <h1>There are no movies for your search term</h1>
    }

    return (
        <div>
            <div data-testid="movies" className='movies-container'>
                {movies.movies.results?.map((movie, i) => {
                    return (
                        <Movie
                            movie={movie}
                            key={movie.id}
                            viewTrailer={viewTrailer}
                            onImageLoad={handleImageLoad}
                        />
                    )
                })}
                {movies.page !== movies.movies.total_pages && (
                  isLoading ? <p>Loading more movies...</p> : <div ref={infinityScrollingRef}>Load more</div>
                )}
            </div>
        </div>
    )
}

export default Movies

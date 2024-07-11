import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"

const DISCOVER_TYPE = 'discover'
const SEARCH_TYPE = 'search'

export const fetchMovies = createAsyncThunk('fetch-movies', async (url, state) => {
    const response = await fetch(url)
    const data = await response.json()
    return {data, url}
})

const initialState = {
    movies: {
        results: [],
        lastResultType: 'discover'
    },
    page: 1,
    lastSearchValue: null,
    fetchStatus: '',
};


const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
      resetMovies: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            const urlObj = new URL(action.payload.url);
            const queryValue = urlObj.searchParams.get('query')
            const isDiscover = action.payload.url.includes(DISCOVER_TYPE);
            const resultType = isDiscover ? DISCOVER_TYPE : SEARCH_TYPE;
            const prevResultType = state.movies.lastResultType;
            const changedResultType = prevResultType !== resultType
            const currentResults = (changedResultType) ? [] : current(state.movies.results);

            let groupedMovies

            if(isDiscover){
                groupedMovies = [...currentResults, ...action.payload.data.results];
            }else if(resultType === SEARCH_TYPE && queryValue === state.lastSearchValue){
                const combinedResults = [...currentResults, ...action.payload.data.results];
                groupedMovies = Array.from(new Set(combinedResults.map(movie => movie.id))).map(id => combinedResults.find(movie => movie.id === id));
            }else{
                groupedMovies = action.payload.data.results;
            }

            state.movies = {
                ...action.payload.data,
                lastResultType: resultType,
                results: groupedMovies,
            };

            state.page = changedResultType ? 1 : state.movies.page + 1
            state.lastSearchValue = queryValue
            state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
export const { resetMovies } = moviesSlice.actions;

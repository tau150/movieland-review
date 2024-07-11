import moviesSlice, { fetchMovies } from '../data/moviesSlice'
import { moviesActionMock } from './movies.mocks'

const initialState = {
    movies: {
        results: [],
        lastResultType: 'discover'
    },
    page: 1,
    lastSearchValue: null,
    fetchStatus: '',
};

describe('MovieSlice test', () => {

    it('should set loading true while action is pending', () => {
        const action = {type: fetchMovies.pending};
        moviesSlice.reducer(initialState, action);
        expect(action).toEqual({type: fetchMovies.pending})
     })

    it('should return payload when action is fulfilled', () => {
        const action = {
            type: fetchMovies.fulfilled,
            payload: moviesActionMock
        };
        moviesSlice.reducer(initialState, action);
        expect(action.payload).toBeTruthy()
    })

    it('should set error when action is rejected', () => {
        const action = {type: fetchMovies.rejected};
        moviesSlice.reducer(initialState, action);
        expect(action).toEqual({type: fetchMovies.rejected})
     })

})
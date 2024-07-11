## General Considerations

- Some test are not passing.
- A domain of our entities should be defined; this will allow us to talk a unique language of our business throughout our entire app.
- I noticed the use of `data-testid` for testing, which should be avoided. Try to get the elements by role or other attributes. `data-testid` should be the last option.
- Tests are consuming real endpoints, that layer should be mocked.
- We don’t really need Redux for this app. I understand that it may have been included because you normally use it in your real codebase. However, I would avoid Redux if I could. Recently, I have been using Tanstack Query, and when you have a way to manage your server state, Redux is not necessary in most cases. Tanstack Query gives you all the state you need about your async calls and manages the cache too. Using this tool, you avoid a lot of boilerplate code that you would write using Redux. For this particular case where you are keeping the star and watch later movies in the state, Redux is a good solution, but in a real app, you probably want to persist that state.
- I noticed there is no difference between pages and components. I would organize them into separate folders to have a clear view of pages and components.
- We could use lazy loading to load our pages only when we need them.
- It would be better to have the styles files next to the component where they are used for easier reference.
- There is no error handling in case our requests fail somehow.
- It is strange that the folder containing slices and store is called `data`. It is more common to use the store name for this folder. `Data` could be associated with some kind of JSON data or something similar.
- It would be nice to wrap the app in an `ErrorBoundary` to catch unhandled errors.

### `src/constants.js`

- The `ENDPOINT_DISCOVER` and `ENDPOINT_SEARCH` are wrong; the `\` just after `movie` should be removed.
- It is not a good idea to have our API key here as a constant. It should be defined in a `.env` file or even better, consumed directly from the back end.

### `src/App.js`

- The routes definition should be moved to an independent file. It will be easier to follow, test, and make changes.
- The logic behind “no trailer available” (line 87) is confusing; we are seeing that message always, even if the user hasn’t made a search yet. This code should not be on top of our router because that makes that message be present in every route. The same happens with the `YoutubePlayer` (line 83). I understand this is because the modal is not yet implemented.
- The `useEffect` in line 73 is not using the `getMovies` function as a dependency, and it should. `getMovies` should be wrapped in a `useCallback` to use as a dependency without causing an infinite loop.
- Line 61: the URL definition should not be there; we already have a constants file with URL definitions, so it should be defined there. Because it needs some parameters, it could be a function that returns the final URL.
- Line 68: we shouldn’t compare against the “Trailer” string; that should be represented by a domain entity or at least be defined in a constants file.
- Line 64: we are mixing `async/await` with the use of promises. I recommend using `async/await` for simplicity.
- I would move all the logic of `getMovie` in line 60 to a custom hook. That would make it much easier to test and separate responsibilities.
- The function `closeCard` in line 25 is defined as empty and is not being used. It is passed to a component that is not using it either.

### `src/styles/movies.scss`

- There are styles defined here that are being used in the `Movie` component and not in `Movies`. Those styles should be in a stylesheet related to the component.

### `src/components/WatchLater.js`

- The block from line 16 to line 32 and from line 35 to line 40 could be split into two separate components and include one or the other based on a ternary operator for this condition: `watchLater.watchLaterMovies.length > 0`.

### `src/components/Stared.js`

- The same observation as in the previous case. In both, we are using the same `Movie` component and the same condition. We could refactor the components mentioned in the previous point to reuse in this page.

### `src/components/Header.js`

- In line 18 and 21, we are using the same value (`starredMovies.length`). We could move it to a constant before the return in line 10 and use that constant.
- In line 33, there is a bug: if we click over the input itself, and not just over the X icon, we are doing a redirect.
- Even when we click over the close icon, the redirect is made, but the input content is not cleared.
- The search made on `onKeyUp` in line 35 should be debounced to avoid overloading our backend with calls while the user is still typing.

### `src/components/Movie.js`

- `myClickHandler` in line 15 is not a proper name for this function. `onButtonClickHandler` or something similar would be better. Besides that, in this function, there are many actions that don’t make sense nowadays. I assume the check for the event and the `stopPropagation` is related to compatibility with old browsers, but it is not necessary nowadays. Last but not least, accessing a DOM element to remove a class is not a good practice in React. We should set a state and, based on that state, add or remove a class name, but not manipulate the DOM directly.
- The actions `starMovie` in line 32 and `addToWatchLater` in line 48 use the same parameters. This could be refactored for simplicity.

### `src/data/moviesSlices.js`

- Plain strings are being used for `fetchStatus` and for the slice name. Those strings should at least be defined in a constants file.

### `src/data/watchLaterSlice.js` and `src/data/starredSlice.js`

- As I mentioned in the components, we have duplicated logic in these files. The way we are removing an element could be moved to a utility file.

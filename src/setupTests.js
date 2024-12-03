import '@testing-library/jest-dom'
jest.setTimeout(10000)
jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

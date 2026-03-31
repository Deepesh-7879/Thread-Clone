import axiosInstance from './axiosInstance'
export const feedApi = {
  getFeed:         (page=1) => axiosInstance.get(`/feed?page=${page}`),
  getExploreFeed:  (page=1) => axiosInstance.get(`/feed/explore?page=${page}`),
  getBookmarksFeed: ()      => axiosInstance.get('/feed/bookmarks'),
}

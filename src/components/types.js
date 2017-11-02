export type Video = {
    id: string,
    type: string,
    image: { url: string },
    title: string
}

export type AppState = {
    videos: Array<Video>,
    loading: boolean,
    filter: Object
}

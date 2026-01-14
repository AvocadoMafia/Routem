export type Route = {
    id: string
    title: string
    user: string
    likesThisWeek: number
    viewsThisWeek?: number
    category: string
    /** URL of the route thumbnail image */
    thumbnailImageSrc?: string
}

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

export type User = {
    id: string;
    name: string;
    likesThisWeek: number;
    viewsThisWeek: number;
    bio?: string;
    location?: string;
    /** URL of the user's profile icon image */
    profileImage?: string;
    /** URL of the user's profile background image */
    profileBackgroundImage?: string;
};

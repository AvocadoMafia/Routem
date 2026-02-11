import {Prisma} from "@prisma/client";

export type Route = Prisma.RouteGetPayload<{
    include: {
        author: {include: {profileImage: true}},
        thumbnail: true,
        likes: true,
        views: true,
        routeNodes: {include: {spot: true}}
    }
}> & {
    likesThisWeek: number;
    viewsThisWeek: number;
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

export type Waypoint = {
    id: string;
    type: 'waypoint';
    name: string;
    images?: string[]; // 経由地の画像URL（最大3枚）
    memo: string;  // 経由地に関するメモ (RouteNode.details)
    order: number; // 並び順
    lat?: number;
    lng?: number;
    mapboxId?: string;
};

export type Transportation = {
    id: string;
    type: 'transportation';
    method: 'walk' | 'train' | 'bus' | 'car' | 'other'; // 移動手段
    memo: string; // 移動に関するメモ（乗り換え情報など）
    order: number;
};

/**
 * ルートを構成する各要素（経由地または交通手段）の共通型
 */
export type RouteItem = Waypoint | Transportation;

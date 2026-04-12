/**
 * ドメイン型定義
 * Prismaスキーマベースの型とカスタム型
 */

import { Prisma } from "@prisma/client"

// ルート型（リレーション込み）
export type Route = Prisma.RouteGetPayload<{
  include: {
    author: { include: { icon: true } }
    thumbnail: true
    likes: true
    views: true
    routeDates: {
      include: {
        routeNodes: { include: { spot: true; transitSteps: true; images: true } }
      }
    }
    tags: true
    collaborators: true
    budget: true
  }
}>

export type RouteWithRelations = Route

// ユーザー型（リレーション込み）
export type User = Prisma.UserGetPayload<{
  include: {
    icon: true
    background: true
    uploadedImages: true
    likes: true
    _count: {
      select: {
        routes: true
      }
    }
  }
}>

// コメント型（リレーション込み）
export type Comment = Prisma.CommentGetPayload<{
  include: {
    user: { select: { id: true; name: true; icon: true } }
    likes: true
  }
}>

// 経由地
export type Waypoint = {
  id?: string
  type: 'waypoint'
  name: string
  images?: string[]
  memo: string
  order: number
  lat?: number
  lng?: number
  source: 'MAPBOX' | 'USER'
  sourceId?: string
}

// 移動手段
export type Transportation = {
  id?: string
  type: 'transportation'
  method: 'WALK' | 'TRAIN' | 'BUS' | 'CAR' | 'BIKE' | 'FLIGHT' | 'SHIP' | 'OTHER'
  memo: string
  order: number
  duration?: number
  distance?: number
}

// ルート構成要素
export type RouteItem = Waypoint | Transportation

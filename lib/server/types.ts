import { Prisma } from '@prisma/client';



export type Route = Prisma.RouteGetPayload<{
    include: {
        author: { include: { profileImage: true } },
        thumbnail: true,
        likes: true,
        views: true,
        routeNodes: {
            include: {
                spot: true,
                images: true,
                transitSteps: true
            }
        },
        category: true,
    }
}>

export type RouteNode = Prisma.RouteNodeGetPayload<{
    include: {
        spot: true,
        images: true,
        transitSteps: true
    }
}>
export type TransitStep = Prisma.TransitStepGetPayload<{
}>
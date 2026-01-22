import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";

export default function RouteListBasic() {

    const mockTopRoutes = [
        { id: 'r1', title: 'Kyoto Old Town Walk', user: 'taro', likesThisWeek: 1280, viewsThisWeek: 18200, category: 'History', thumbnailImageSrc: '/mockImages/Kyoto.jpg' },
        { id: 'r2', title: 'Okinawa Beach Hopping', user: 'hanako', likesThisWeek: 990, viewsThisWeek: 15420, category: 'Beach', thumbnailImageSrc: '/mockImages/Okinawa.jpg' },
        { id: 'r3', title: 'Hokkaido Food Trip', user: 'satoshi', likesThisWeek: 1570, viewsThisWeek: 21030, category: 'Food', thumbnailImageSrc: '/mockImages/Hokkaido.jpg' },
        { id: 'r4', title: 'Tokyo Night Lights', user: 'emi', likesThisWeek: 870, viewsThisWeek: 16800, category: 'City', thumbnailImageSrc: '/mockImages/Tokyo.jpg' },
        { id: 'r5', title: 'Nara Temple Circuit', user: 'ken', likesThisWeek: 1430, viewsThisWeek: 19990, category: 'Culture', thumbnailImageSrc: '/mockImages/Nara.jpg' },
        { id: 'r6', title: 'Mount Fuji Scenic Drive', user: 'yuki', likesThisWeek: 760, viewsThisWeek: 14550, category: 'Nature', thumbnailImageSrc: '/mockImages/Fuji.jpg' },
    ]


    return (
        <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
            {mockTopRoutes.map((r, idx) => (
                <RouteCardBasic route={r} key={idx}/>
            ))}
        </div>
    )
}

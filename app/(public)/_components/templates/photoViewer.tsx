import PhotoContainer from "@/app/(public)/_components/ingredients/photoContainer";
import Masonry from "react-masonry-css";


export default function PhotoViewer(props: {}) {
    const mockArray = Array.from({length: 30})

    const breakpoints = {
        default: 3,
        1280: 2,
    };

    return (
        <Masonry
            breakpointCols={breakpoints}
            className="flex md:gap-2 gap-1"
            columnClassName="flex flex-col md:gap-2 gap-1"
        >
            {mockArray.map((_, i) => (
                <PhotoContainer key={i} test={Math.floor(Math.random() * 3)}/>
            ))}
        </Masonry>
    )
}

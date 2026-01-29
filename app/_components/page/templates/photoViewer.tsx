import PhotoContainer from "@/app/_components/page/ingredients/photoContainer";
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
            className="flex gap-2"
            columnClassName="flex flex-col gap-2"
        >
            {mockArray.map((_, i) => (
                <PhotoContainer key={i} test={Math.floor(Math.random() * 3)}/>
            ))}
        </Masonry>
    )
}

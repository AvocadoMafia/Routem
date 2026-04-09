import Octopus from "@/public/art/octopus.svg";

type Props = {
    className?: string;
}

export default function FuckingOctopus(props: Props) {
    return (
        <Octopus className={props.className}/>
    )
}

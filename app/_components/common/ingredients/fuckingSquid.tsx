import Squid from "@/public/art/squid.svg";

interface Props {
    className?: string;
}

export default function FuckingSquid(props: Props) {
    return (
        <Squid className={props.className}/>
    )
}
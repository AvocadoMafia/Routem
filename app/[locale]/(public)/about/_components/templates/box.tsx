'use client'

import {useFrame} from "@react-three/fiber";
import {useRef} from "react";
import {Mesh} from "three";

export default function Box() {

    const ref = useRef<Mesh>(null!)

    useFrame(() => {
        ref.current.rotation.x += 0.01
        ref.current.rotation.y += 0.01
    })

    return (
        <mesh rotation={[0.4, 0.2, 0]} ref={ref}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="gray" metalness={1}/>
        </mesh>
    )
}
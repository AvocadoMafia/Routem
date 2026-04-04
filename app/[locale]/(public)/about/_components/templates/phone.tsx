import {RoundedBox, useTexture} from "@react-three/drei";
import {useRef} from "react";
import {Group} from "three";
import {useFrame} from "@react-three/fiber";

export default function Phone() {

    const screenTexture = useTexture('/mockImages/Fuji.jpg')

    const ref = useRef<Group>(null!)

    useFrame(() => {
        ref.current.rotation.y += 0.01
    })

    return (
        <group ref={ref}>
            {/* スマホ本体 */}
            <RoundedBox args={[2.2, 4.4, 0.2]} radius={0.1} smoothness={4}>
                <meshStandardMaterial color="gray" metalness={1}/>
            </RoundedBox>

            {/* スクリーン */}
            <mesh position={[0, 0, 0.105]}>
                <planeGeometry args={[2, 4]} />
                <meshBasicMaterial map={screenTexture} />
            </mesh>
        </group>
    )
}
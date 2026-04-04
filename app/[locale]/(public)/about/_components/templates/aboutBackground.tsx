'use client'

import {Canvas} from "@react-three/fiber";
import {Suspense} from "react";
import Box from "@/app/[locale]/(public)/about/_components/templates/box";
import Phone from "@/app/[locale]/(public)/about/_components/templates/phone";

export default function AboutBackground() {
  return (
    <div className="fixed inset-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} />
          <Phone/>
        </Suspense>
      </Canvas>
    </div>
  )
}

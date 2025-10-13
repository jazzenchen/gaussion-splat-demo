"use client"

import { Application, Entity } from '@playcanvas/react'
import { Camera, GSplat, Script } from '@playcanvas/react/components'
import { useSplat } from '@playcanvas/react/hooks'
import { CustomCameraControls } from './custom-camera-controls'

function ToyCat() {
    const { asset } = useSplat('output1/meta.json');
    if (!asset) return null;

    return (
        <Entity position={[-1, 0, 1]} rotation={[90, 90, 180]}>
            <GSplat asset={asset} />
        </Entity>
    );
}

export default function App() {
    return (
        <Application graphicsDeviceOptions={{ antialias: false }} >
            <Entity name="Camera" position={[0, 0, 2.5]}>
                <Camera />
                <Script script={CustomCameraControls} />
            </Entity>
            <ToyCat />
        </Application>
    );
}
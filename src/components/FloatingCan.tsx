'use client'

import { Float } from "@react-three/drei";
import { forwardRef,ReactNode } from "react";
import { SodaCan,SodaCanProps } from "./SodCan";
import { Group } from "three";

type FloatingCanProps = {
    flavor?: SodaCanProps["flavor"],
    floatSpeed?: number,
    floatIntensity?: number,
    floatingRange?: [number,number],
    rotationIntensity?: number,
    children?: ReactNode
};

const FloatingCan = forwardRef<Group,FloatingCanProps>(({
    children,
    flavor = 'blackCherry',
    floatIntensity = 1,
    floatSpeed = 1.5,
    rotationIntensity = 1,
    floatingRange = [-0.1,0.1],
    ...props
},ref) => {
    return (
        <group ref={ref} {...props}>
            <Float
                speed={floatSpeed}
                rotationIntensity={rotationIntensity}
                floatIntensity={floatIntensity}
                floatingRange={floatingRange}
            >
                {children}
                <SodaCan flavor={flavor} />
            </Float>
        </group>
    );
});

FloatingCan.displayName = "FloatingCan"

export default FloatingCan;

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Content } from "@prismicio/client";
import { Cloud,Clouds,Environment,Text } from "@react-three/drei";
import React,{ useRef } from "react";
import * as THREE from 'three'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type SkyDiveProps = {
    sentence: string | null,
    flavor: Content.SkyDiveSliceDefaultPrimary["flavor"]
};


gsap.registerPlugin(useGSAP,ScrollTrigger)

export default function Scene({ sentence,flavor }: SkyDiveProps) {

    const groupRef = useRef<THREE.Group>(null)
    const canRef = useRef<THREE.Group>(null)
    const cloud1Ref = useRef<THREE.Group>(null)
    const cloud2Ref = useRef<THREE.Group>(null)
    const cloudsRef = useRef<THREE.Group>(null)
    const wordsRef = useRef<THREE.Group>(null)

    const ANGLE = 75 * (Math.PI / 180)

    const getXPosition = (distance: number) => distance * Math.cos(ANGLE)
    const getYPosition = (distance: number) => distance * Math.sin(ANGLE)

    const getXYPositions = (distance: number) => ({
        x: getXPosition(distance),
        y: getYPosition(-1 * distance)
    })
    useGSAP(() => {
        if (
            !cloud1Ref.current ||
            !cloud2Ref.current ||
            !cloudsRef.current ||
            !canRef.current ||
            !wordsRef.current
        ) {
            return
        }


        gsap.set(cloudsRef.current.position,{ z: 10 })
        gsap.set(canRef.current.position,{
            ...getXYPositions(-4)
        })

        gsap.set(wordsRef.current.children.map((word) => word.position),{
            ...getXYPositions(7),
            z: 2
        })

        gsap.to(canRef.current.rotation,{
            y: Math.PI * 2,
            duration: 1.7,
            repeat: -1,
            ease: "none"
        })

        const DISTANCE = 15
        const DURATION = 6

        gsap.set([cloud1Ref.current.position,cloud2Ref.current.position],{
            ...getXYPositions(DISTANCE)
        })

        gsap.to(cloud1Ref.current.position,{
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            duration: DURATION
        })

        gsap.to(cloud2Ref.current.position,{
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            duration: DURATION,
            delay: DURATION / 2
        })

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.skydive',
                pin: true,
                start: "top top",
                end: "+=2000",
                scrub: 1.5,
            }
        })

        scrollTl
            .to("body",{
                backgroundColor: '#C0F0F5',
                overwrite: "auto",
                duration: 0.1
            })
            .to(cloudsRef.current.position,{ z: 0,duration: 0.3 },0)
            .to(canRef.current.position,{ x: 0,y: 0,duration: 0.3,ease: "back.out(1.7)" })
            .to(wordsRef.current.children.map((word) => word.position),
                {
                    keyframes: [
                        {
                            x: 0,
                            y: 0,
                            z: -1
                        },
                        { ...getXYPositions(-7),z: -7 }
                    ],
                    stagger: 0.3
                },0)
            .to(canRef.current.position,{
                ...getXYPositions(4),
                duration: 0.5,
                ease: "back.in(1.7)"
            })
            .to(cloudsRef.current.position,{
                z: 7,duration: 0.5
            })
    })

    return (
        <group ref={groupRef}>
            <group rotation={[0,0,0.5]}>
                <FloatingCan ref={canRef} flavor={flavor} floatIntensity={3} floatSpeed={3} rotationIntensity={0}>
                    <pointLight intensity={30} color="#8C0413" decay={0.5} />
                </FloatingCan>
            </group>
            <Clouds ref={cloudsRef}>
                <Cloud ref={cloud1Ref} bounds={[10,10,2]} />
                <Cloud ref={cloud2Ref} bounds={[10,10,2]} />
            </Clouds>

            <group ref={wordsRef}>
                {sentence && <ThreeText sentence={sentence} color="#F97315" />}
            </group>
            <ambientLight intensity={2} color="#9DDEFA" />
            <Environment files="./hdr/field.hdr" environmentIntensity={1.5} />
        </group>
    );
}


function ThreeText({ sentence,color = "white" }: { sentence: string,color?: string }) {
    const words = sentence.toUpperCase().split(" ")
    const material = new THREE.MeshLambertMaterial()

    const isDeskTop = useMediaQuery("(min-width: 950px)",true)

    return words.map((word: string,wordIndex: number) => (
        <Text
            key={`${word}-${wordIndex}`}
            color={color} scale={isDeskTop ? 1 : 0.5}
            material={material}
            font="/fonts/Alpino-Variable.woff"
            fontWeight={900}
            anchorX="center"
            anchorY="middle"
            characters="ABCDEFGHIJKLMNOPQRSTWXYZ"
        >
            {word}
        </Text>
    ))
}
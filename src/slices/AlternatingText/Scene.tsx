import FloatingCan from "@/components/FloatingCan";
import { Environment } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Group } from "three";
import gsap from "gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";


type Props = {};


gsap.registerPlugin(useGSAP,ScrollTrigger)
export default function Scene({ }: Props) {
    const isDeskTop = useMediaQuery("(min-width: 768px)",true);

    const canRef = useRef<Group>(null);

    const bgColors = ["#FFA6B5","#E9CFF6","#CBEF9A"];


    useGSAP(() => {
        if (!canRef) return

        const sections = gsap.utils.toArray('.alternating-section')

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".alternating-text-view",
                endTrigger: ".alternating-text-container",
                pin: true,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        })
        sections.forEach((_,index) => {
            if (!canRef) return
            if (index === 0) return

            const isOdd = index % 2 !== 0

            const xPosition = isDeskTop ? (isOdd ? "-1" : "1") : 0

            if (canRef.current) {
                scrollTl.to(canRef.current.position,{
                    x: xPosition,
                    ease: 'circ.inOut',
                    delay: 0.5
                })
                scrollTl.to(canRef.current.rotation,{
                    y: isOdd ? "0.4" : "-0.4",
                    ease: 'back.inOut',
                },"<")
                    .to(".alternating-text-container",{
                        backgroundColor: gsap.utils.wrap(bgColors,index)
                    })
            }
        })
    },{ dependencies: [isDeskTop] })
    return (
        <group ref={canRef} position-x={isDeskTop ? 1 : 0} rotation-y={-0.3}>
            <FloatingCan flavor="strawberryLemonade" />
            <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
        </group>
    );
}

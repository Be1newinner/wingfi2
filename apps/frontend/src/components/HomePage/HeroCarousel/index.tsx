"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const SLIDES = [
    {
        id: 1,
        image: "/dummy/sliders/furniture-banner-1.jpeg",
        alt: "slider_1",
    },
    {
        id: 2,
        image: "/dummy/sliders/furniture-banner-2.jpeg",
        alt: "slider_2",
    },
    {
        id: 3,
        image: "/dummy/sliders/furniture-banner-1.jpeg",
        alt: "slider_3",
    },
];

export function HeroCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    const scrollTo = (index: number) => emblaApi?.scrollTo(index);

    return (
        <div className="relative w-full">
            {/* Slider */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex *:shrink-0 *:grow-0 *:basis-full">
                    {SLIDES.map((slide) => (
                        <div key={slide.id} className="relative w-full">
                            <Image
                                src={slide.image}
                                alt={slide.alt}
                                width={1920}
                                height={640}
                                priority
                                className="w-full h-auto transition-opacity duration-700"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <CarouselNavButton
                Icon={ChevronLeft}
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                position="left-4"
            />
            <CarouselNavButton
                Icon={ChevronRight}
                onClick={scrollNext}
                disabled={!canScrollNext}
                position="right-4"
            />

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={clsx(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            selectedIndex === index
                                ? "bg-cyan-400 scale-110 shadow"
                                : "bg-cyan-200/50 hover:bg-cyan-200"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

type NavButtonProps = {
    onClick: () => void;
    disabled: boolean;
    position: string;
    Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
};

function CarouselNavButton({ onClick, disabled, position, Icon }: NavButtonProps) {
    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white transition-colors duration-300 shadow rounded-full border hover:border-slate-300",
                position,
                disabled && "opacity-0 pointer-events-none"
            )}
        >
            <Icon className="w-5 h-5 text-black" />
        </Button>
    );
}

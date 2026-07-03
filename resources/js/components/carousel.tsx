import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselProps {
    children: React.ReactNode;
    options?: EmblaOptionsType;
    className?: string;
}

export default function Carousel({ children, options, className }: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', ...options });
    const [prevEnabled, setPrevEnabled] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevEnabled(emblaApi.canScrollPrev());
        setNextEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className={className}>
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-4">
                    {children}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    disabled={!prevEnabled}
                    className="h-8 w-8"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    disabled={!nextEnabled}
                    className="h-8 w-8"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

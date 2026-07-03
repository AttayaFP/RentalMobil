import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options?: { y?: number; duration?: number; stagger?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const elements = containerRef.current!.querySelectorAll('.reveal');
            gsap.set(elements, { autoAlpha: 0, y: options?.y ?? 40 });

            ScrollTrigger.batch(elements, {
                onEnter: (batch) => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: options?.duration ?? 0.7,
                        stagger: options?.stagger ?? 0.12,
                        ease: 'power3.out',
                    });
                },
                start: 'top 88%',
                once: true,
            });
        }, containerRef);

        return () => ctx.revert();
    }, [options?.y, options?.duration, options?.stagger]);

    return containerRef;
}

export function useStaggerReveal(options?: { y?: number; duration?: number; stagger?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const items = containerRef.current!.querySelectorAll('.stagger-item');
            gsap.set(items, { autoAlpha: 0, y: options?.y ?? 30 });

            ScrollTrigger.batch(items, {
                onEnter: (batch) => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: options?.duration ?? 0.6,
                        stagger: options?.stagger ?? 0.1,
                        ease: 'power2.out',
                    });
                },
                start: 'top 90%',
                once: true,
            });
        }, containerRef);

        return () => ctx.revert();
    }, [options?.y, options?.duration, options?.stagger]);

    return containerRef;
}

export function useHeroAnimation() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.hero-title', { y: 60, autoAlpha: 0, duration: 1 })
              .from('.hero-sub', { y: 40, autoAlpha: 0, duration: 0.8 }, '-=0.5')
              .from('.hero-cta', { y: 30, autoAlpha: 0, duration: 0.6, scale: 0.9 }, '-=0.4')
              .from('.hero-badge', { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return sectionRef;
}

export function useCountUp(endValue: number, options?: { duration?: number; prefix?: string; suffix?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            const obj = { value: 0 };

            ScrollTrigger.create({
                trigger: ref.current,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        value: endValue,
                        duration: options?.duration ?? 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (ref.current) {
                                const formatted = Math.floor(obj.value).toLocaleString('id-ID');
                                ref.current.textContent = (options?.prefix ?? '') + formatted + (options?.suffix ?? '');
                            }
                        },
                    });
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [endValue, options?.duration, options?.prefix, options?.suffix]);

    return ref;
}

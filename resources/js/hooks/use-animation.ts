import { useRef, useEffect, useCallback } from 'react';
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

export function useParallax(speed?: number) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                yPercent: (speed ?? 0.3) * -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [speed]);

    return ref;
}

export function useTextSplit() {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;
        const text = el.textContent ?? '';
        el.innerHTML = '';

        const chars = text.split('').map((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            el.appendChild(span);
            return span;
        });

        const ctx = gsap.context(() => {
            gsap.set(chars, { autoAlpha: 0, y: 40, rotateX: -90 });

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(chars, {
                        autoAlpha: 1,
                        y: 0,
                        rotateX: 0,
                        duration: 0.6,
                        stagger: 0.03,
                        ease: 'back.out(1.7)',
                    });
                },
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    return ref;
}

export function useMagneticButton(strength?: number) {
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const factor = strength ?? 0.35;

        gsap.to(ref.current, {
            x: x * factor,
            y: y * factor,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener('mousemove', handleMouseMove as EventListener);
        el.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove as EventListener);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return ref;
}

export function useMarquee(speed?: number) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const inner = containerRef.current!.querySelector('.marquee-inner');
            if (!inner) return;

            const totalWidth = inner.scrollWidth / 2;

            gsap.to(inner, {
                x: -totalWidth,
                duration: speed ?? 30,
                ease: 'none',
                repeat: -1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, [speed]);

    return containerRef;
}

export function useScaleReveal() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.set(ref.current, { autoAlpha: 0, scale: 0.8 });

            ScrollTrigger.create({
                trigger: ref.current,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(ref.current, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                    });
                },
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    return ref;
}

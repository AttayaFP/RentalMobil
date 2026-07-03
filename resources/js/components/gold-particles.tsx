import { useEffect, useMemo, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from '@tsparticles/engine';
import type { ISourceOptions } from '@tsparticles/engine';

export default function GoldParticles() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadSlim(tsParticles).then(() => setReady(true));
    }, []);

    const options: ISourceOptions = useMemo(() => ({
        fullScreen: false,
        fpsLimit: 60,
        particles: {
            number: { value: 40, density: { enable: true, width: 1200, height: 800 } },
            color: { value: ['#FFC000', '#FFCE3E', '#917300'] },
            shape: { type: 'circle' },
            opacity: {
                value: { min: 0.1, max: 0.5 },
            },
            size: {
                value: { min: 1, max: 4 },
            },
            move: {
                enable: true,
                speed: { min: 0.3, max: 1.2 },
                direction: 'none',
                outModes: { default: 'out' },
            },
            links: {
                enable: true,
                distance: 150,
                color: '#FFC000',
                opacity: 0.08,
                width: 1,
            },
        },
        detectRetina: true,
    }), []);

    if (!ready) return null;

    return (
        <Particles
            id="gold-particles"
            options={options}
            className="pointer-events-none absolute inset-0 z-0"
        />
    );
}

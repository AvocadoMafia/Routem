"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring } from "framer-motion";

export default function UsageSection() {
    const t = useTranslations('about');
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef    = useRef<HTMLDivElement>(null);
    const itemRefs     = useRef<(HTMLDivElement | null)[]>([]);

    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
    const [layout, setLayout] = useState<{
        pathD: string;
        pins: { x: number; y: number }[];
    } | null>(null);

    useEffect(() => {
        const el = document.getElementById('main-scroll-container');
        if (el) setScrollElement(el);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: scrollElement ? { current: scrollElement } : undefined,
        offset: ["start center", "end center"],
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // --- Layout computation ---
    // Pin x = fixed margin from edges (not measured from pin DOM element).
    // Pin y = center of each item (measured from item BoundingRect).
    // Both SVG path and rendered dots use the same (x,y) → always aligned.
    const compute = useCallback(() => {
        if (!scrollRef.current) return;
        const sr = scrollRef.current;
        const srRect = sr.getBoundingClientRect();
        const W = srRect.width;
        const H = srRect.height;

        // Responsive margin: stays within the item's padding zone
        const isMobile = W < 768;
        const MARGIN = isMobile ? Math.min(20, W * 0.05) : Math.max(24, Math.min(96, W * 0.08));

        const pins = itemRefs.current.map((ref, i) => {
            if (!ref) return null;
            const r = ref.getBoundingClientRect();
            return {
                x: i % 2 === 0 ? W - MARGIN : MARGIN,
                y: r.top + r.height / 2 - srRect.top,
            };
        }).filter((p): p is { x: number; y: number } => p !== null);

        if (pins.length < 2) return;

        // Build orthogonal path with rounded corners
        const RADIUS = 36;
        let d = `M ${pins[0].x} 0 L ${pins[0].x} ${pins[0].y}`;

        for (let i = 0; i < pins.length - 1; i++) {
            const p1 = pins[i];
            const p2 = pins[i + 1];
            const midY = (p1.y + p2.y) / 2;
            const r    = Math.min(RADIUS, (p2.y - p1.y) / 4);
            const hr   = p2.x > p1.x ? r : -r;

            d += ` L ${p1.x} ${midY - r}`;                    // straight down
            d += ` Q ${p1.x} ${midY} ${p1.x + hr} ${midY}`;  // turn horizontal
            d += ` L ${p2.x - hr} ${midY}`;                   // straight across
            d += ` Q ${p2.x} ${midY} ${p2.x} ${midY + r}`;   // turn down
            d += ` L ${p2.x} ${p2.y}`;                        // straight to pin
        }

        d += ` L ${pins[pins.length - 1].x} ${H}`;            // exit to bottom

        setLayout({ pathD: d, pins });
    }, []);

    useEffect(() => {
        const timer = setTimeout(compute, 300);
        window.addEventListener('resize', compute);

        // Re-compute when images finish loading (can shift item heights)
        const imgs = scrollRef.current?.querySelectorAll('img') ?? [];
        imgs.forEach(img => img.addEventListener('load', compute));

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', compute);
            imgs.forEach(img => img.removeEventListener('load', compute));
        };
    }, [compute]);

    const items = [
        {
            id: 1,
            step: t('step1'),
            title: t('findRouteTitle'),
            description: t('findRouteDesc'),
            image: "\n" +
                "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2Fusage-1.webp",
        },
        {
            id: 2,
            step: t('step2'),
            title: t('collabEditTitle'),
            description: t('collabEditDesc'),
            image: "\n" +
                "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2Fusage-2.webp",
        },
        {
            id: 3,
            step: t('step3'),
            title: t('postMemoriesTitle'),
            description: t('postMemoriesDesc'),
            image: "\n" +
                "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2Fusage-3.webp",
        },
        {
            id: 4,
            step: t('step4'),
            title: t('reactionsTitle'),
            description: t('reactionsDesc'),
            image: "\n" +
                "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2Fusage-4.webp",
        },
    ];

    return (
        <section ref={containerRef} className="relative w-full py-24 bg-background-0">
            <div className="w-full relative">
                {/* Section header */}
                <motion.div
                    className="text-center mb-20 px-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className="text-4xl md:text-7xl font-black text-foreground-0 mb-4 tracking-tighter">
                        {t('stepsTitle')}
                    </h2>
                    <p className="text-sm md:text-base text-foreground-1/60 max-w-xl mx-auto leading-relaxed">
                        {t('aboutDescription')}
                    </p>
                </motion.div>

                {/* Timeline container */}
                <div ref={scrollRef} className="relative flex flex-col">

                    {/* SVG path — uses same coordinates as pin state */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        aria-hidden="true"
                        style={{ overflow: 'visible' }}
                    >
                        {layout && (
                            <>
                                {/* Background dashed track */}
                                <path
                                    d={layout.pathD}
                                    fill="none"
                                    stroke="var(--grass)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 10"
                                    opacity="0.8"
                                />
                                {/* Animated progress line */}
                                <motion.path
                                    d={layout.pathD}
                                    fill="none"
                                    stroke="var(--accent-0)"
                                    strokeWidth="2"
                                    style={{ pathLength }}
                                />
                            </>
                        )}
                    </svg>

                    {/* Pin dots — positioned with same (x,y) as path vertices */}
                    {layout?.pins.map((pin, i) => (
                        <motion.div
                            key={i}
                            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: pin.x, top: pin.y }}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        >
                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-background-0 border-2 border-accent-0 shadow-[0_0_14px_rgba(255,99,99,0.5)] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-0" />
                            </div>
                        </motion.div>
                    ))}

                    {/* Items */}
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            ref={el => { itemRefs.current[index] = el; }}
                            className={`relative w-full flex flex-col ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            } items-center gap-10 md:gap-16 px-10 md:px-32 lg:px-48 py-15 md:py-20`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Image */}
                            <motion.div
                                className="w-full md:w-[35%] md:min-w-[300px] overflow-hidden rounded-2xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Text */}
                            <motion.div
                                className="w-full md:w-[45%] flex flex-col gap-5"
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-foreground-0/15 text-xs font-mono tabular-nums">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="w-5 h-px bg-grass" />
                                    <span className="text-accent-0 text-[10px] font-mono uppercase tracking-[0.14em]">
                                        {item.step}
                                    </span>
                                </div>

                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground-0 leading-[1.15] tracking-tight">
                                    {item.title}
                                </h3>

                                <div className="w-10 h-px bg-accent-0/40" />

                                <p className="text-foreground-1 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

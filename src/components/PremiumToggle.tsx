'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './PremiumToggle.module.css';

interface PremiumToggleProps {
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
}

export function PremiumToggle({ defaultChecked = false, onChange, label }: PremiumToggleProps) {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const [isPressed, setIsPressed] = useState(false);

    const handleToggle = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
    };

    return (
        <div className={styles.wrapper}>
            {label && (
                <span className={cn(styles.label, isChecked ? styles.labelChecked : styles.labelUnchecked)}>
                    {label}
                </span>
            )}
            <button
                role="switch"
                aria-checked={isChecked}
                onClick={handleToggle}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                className={cn(styles.track, isChecked ? styles.trackChecked : styles.trackUnchecked)}
            >
                {/* Glow effect */}
                <div className={cn(styles.glow, isChecked ? styles.glowOn : styles.glowOff)} />

                {/* Track inner gradient */}
                <div className={cn(styles.trackInner, isChecked ? styles.trackInnerChecked : styles.trackInnerUnchecked)} />

                {/* Thumb */}
                <div
                    className={cn(
                        styles.thumb,
                        isChecked ? styles.thumbChecked : styles.thumbUnchecked,
                        isPressed && (isChecked ? styles.thumbPressedChecked : styles.thumbPressed),
                    )}
                >
                    {/* Thumb inner shine */}
                    <div className={styles.thumbShine} />

                    {/* Thumb highlight */}
                    <div className={styles.thumbHighlight} />

                    {/* Status indicator dot */}
                    <div className={cn(styles.dot, isChecked ? styles.dotChecked : styles.dotUnchecked)} />

                    {/* Ripple effect on toggle */}
                    <div
                        className={cn(styles.ripple, isChecked ? styles.rippleOn : styles.rippleOff)}
                        key={isChecked ? 'on' : 'off'}
                    />
                </div>
            </button>
        </div>
    );
}

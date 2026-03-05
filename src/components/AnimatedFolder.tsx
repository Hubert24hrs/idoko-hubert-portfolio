'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef, useMemo } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './AnimatedFolder.module.css';

/* =========================================================================
 *                              TYPES
 * ========================================================================= */
export interface FolderProject {
    id: string;
    image: string;
    title: string;
    liveUrl?: string | null;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200';

/* =========================================================================
 *                              PROJECT CARD (inside folder)
 * ========================================================================= */
interface ProjectCardProps {
    image: string;
    title: string;
    delay: number;
    isVisible: boolean;
    index: number;
    totalCount: number;
    onClick: () => void;
    isSelected: boolean;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
    ({ image, title, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
        const middleIndex = (totalCount - 1) / 2;
        const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
        const rotation = factor * 25;
        const translationX = factor * 85;
        const translationY = Math.abs(factor) * 12;

        return (
            <div
                ref={ref}
                className={cn(styles.projectPreviewCard, isSelected && styles.projectPreviewCardHidden)}
                style={{
                    transform: isVisible
                        ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
                        : 'translateY(0px) translateX(0px) rotate(0deg) scale(0.4)',
                    opacity: isSelected ? 0 : isVisible ? 1 : 0,
                    transitionDelay: `${delay}ms`,
                    zIndex: 10 + index,
                }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                <div className={styles.projectPreviewCardInner}>
                    <img
                        src={image || PLACEHOLDER_IMAGE}
                        alt={title}
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                    />
                    <div className={styles.projectPreviewOverlay} />
                    <p className={styles.projectPreviewTitle}>{title}</p>
                </div>
            </div>
        );
    }
);
ProjectCard.displayName = 'ProjectCard';

/* =========================================================================
 *                              IMAGE LIGHTBOX
 * ========================================================================= */
interface ImageLightboxProps {
    projects: FolderProject[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    sourceRect: DOMRect | null;
    onCloseComplete?: () => void;
    onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
    projects, currentIndex, isOpen, onClose, sourceRect, onCloseComplete, onNavigate,
}) => {
    const [animationPhase, setAnimationPhase] = useState<'initial' | 'animating' | 'complete'>('initial');
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [internalIndex, setInternalIndex] = useState(currentIndex);
    const [isSliding, setIsSliding] = useState(false);

    const totalProjects = projects.length;
    const hasNext = internalIndex < totalProjects - 1;
    const hasPrev = internalIndex > 0;
    const currentProject = projects[internalIndex];

    useEffect(() => {
        if (isOpen && currentIndex !== internalIndex && !isSliding) {
            setIsSliding(true);
            const timer = setTimeout(() => {
                setInternalIndex(currentIndex);
                setIsSliding(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isOpen, internalIndex, isSliding]);

    useEffect(() => {
        if (isOpen) { setInternalIndex(currentIndex); setIsSliding(false); }
    }, [isOpen, currentIndex]);

    const navigateNext = useCallback(() => {
        if (internalIndex >= totalProjects - 1 || isSliding) return;
        onNavigate(internalIndex + 1);
    }, [internalIndex, totalProjects, isSliding, onNavigate]);

    const navigatePrev = useCallback(() => {
        if (internalIndex <= 0 || isSliding) return;
        onNavigate(internalIndex - 1);
    }, [internalIndex, isSliding, onNavigate]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        onClose();
        setTimeout(() => {
            setIsClosing(false);
            setShouldRender(false);
            setAnimationPhase('initial');
            onCloseComplete?.();
        }, 500);
    }, [onClose, onCloseComplete]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') navigateNext();
            if (e.key === 'ArrowLeft') navigatePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleClose, navigateNext, navigatePrev]);

    useLayoutEffect(() => {
        if (isOpen && sourceRect) {
            setShouldRender(true);
            setAnimationPhase('initial');
            setIsClosing(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimationPhase('animating'));
            });
            const timer = setTimeout(() => setAnimationPhase('complete'), 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen, sourceRect]);

    const handleDotClick = (idx: number) => {
        if (isSliding || idx === internalIndex) return;
        onNavigate(idx);
    };

    if (!shouldRender || !currentProject) return null;

    const getInitialStyles = (): React.CSSProperties => {
        if (!sourceRect) return {};
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const tw = Math.min(800, vw - 64);
        const th = Math.min(vh * 0.85, 600);
        const tx = (vw - tw) / 2;
        const ty = (vh - th) / 2;
        const scaleX = sourceRect.width / tw;
        const scaleY = sourceRect.height / th;
        const scale = Math.max(scaleX, scaleY);
        const translateX = sourceRect.left + sourceRect.width / 2 - (tx + tw / 2) + window.scrollX;
        const translateY = sourceRect.top + sourceRect.height / 2 - (ty + th / 2) + window.scrollY;
        return { transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`, opacity: 0.5, borderRadius: '12px' };
    };

    const getFinalStyles = (): React.CSSProperties => ({
        transform: 'translate(0, 0) scale(1)', opacity: 1, borderRadius: '24px',
    });

    const currentStyles = animationPhase === 'initial' && !isClosing ? getInitialStyles() : getFinalStyles();

    return (
        <div
            className={styles.lightboxOverlay}
            onClick={handleClose}
            style={{ opacity: isClosing ? 0 : 1, transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
            <div
                className={styles.lightboxBackdrop}
                style={{
                    opacity: (animationPhase === 'initial' && !isClosing) ? 0 : 1,
                    transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            />

            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className={styles.lightboxClose}
                style={{
                    opacity: animationPhase === 'complete' && !isClosing ? 1 : 0,
                    transform: animationPhase === 'complete' && !isClosing ? 'translateY(0)' : 'translateY(-30px)',
                    transition: 'opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
                }}
            >
                <X size={20} strokeWidth={2.5} />
            </button>

            {/* Nav buttons */}
            <button
                onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                disabled={!hasPrev || isSliding}
                className={cn(styles.lightboxNavBtn, styles.lightboxNavBtnLeft)}
                style={{
                    opacity: animationPhase === 'complete' && !isClosing && hasPrev ? 1 : 0,
                    transform: animationPhase === 'complete' && !isClosing ? 'translateX(0)' : 'translateX(-40px)',
                    transition: 'opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms',
                }}
            >
                <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                disabled={!hasNext || isSliding}
                className={cn(styles.lightboxNavBtn, styles.lightboxNavBtnRight)}
                style={{
                    opacity: animationPhase === 'complete' && !isClosing && hasNext ? 1 : 0,
                    transform: animationPhase === 'complete' && !isClosing ? 'translateX(0)' : 'translateX(40px)',
                    transition: 'opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms',
                }}
            >
                <ChevronRight size={24} strokeWidth={3} />
            </button>

            {/* Content */}
            <div
                className={styles.lightboxContent}
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...currentStyles,
                    transform: isClosing ? 'translate(0, 0) scale(0.92)' : currentStyles.transform,
                    transition: animationPhase === 'initial' && !isClosing
                        ? 'none'
                        : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out, border-radius 700ms ease',
                    transformOrigin: 'center center',
                }}
            >
                <div className={styles.lightboxCard}>
                    <div className={styles.lightboxImageArea}>
                        <div
                            className={styles.lightboxSlider}
                            style={{
                                transform: `translateX(-${internalIndex * 100}%)`,
                                transition: isSliding ? 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                            }}
                        >
                            {projects.map((project) => (
                                <div key={project.id} className={styles.lightboxSlide}>
                                    <img
                                        src={project.image || PLACEHOLDER_IMAGE}
                                        alt={project.title}
                                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                                    />
                                    <div className={styles.lightboxSlideOverlay} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className={styles.lightboxFooter}
                        style={{
                            opacity: animationPhase === 'complete' && !isClosing ? 1 : 0,
                            transform: animationPhase === 'complete' && !isClosing ? 'translateY(0)' : 'translateY(40px)',
                            transition: 'opacity 500ms ease-out 500ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
                        }}
                    >
                        <div className={styles.lightboxFooterInner}>
                            <div className={styles.lightboxFooterInfo}>
                                <h3 className={styles.lightboxProjectTitle}>{currentProject?.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                    <div className={styles.lightboxDots}>
                                        {projects.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleDotClick(idx)}
                                                className={cn(styles.lightboxDot, idx === internalIndex && styles.lightboxDotActive)}
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.lightboxCounter}>{internalIndex + 1} / {totalProjects}</p>
                                </div>
                            </div>
                            {currentProject?.liveUrl && (
                                <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.lightboxViewBtn}>
                                    <span>View Project</span>
                                    <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* =========================================================================
 *                              ANIMATED FOLDER
 * ========================================================================= */
interface AnimatedFolderProps {
    title: string;
    projects: FolderProject[];
    className?: string;
    gradient?: string;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ title, projects, className, gradient }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
    const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const previewProjects = projects.slice(0, 5);

    const handleProjectClick = (project: FolderProject, index: number) => {
        const cardEl = cardRefs.current[index];
        if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
        setSelectedIndex(index);
        setHiddenCardId(project.id);
    };

    const handleCloseLightbox = () => { setSelectedIndex(null); setSourceRect(null); };
    const handleCloseComplete = () => { setHiddenCardId(null); };
    const handleNavigate = (newIndex: number) => {
        setSelectedIndex(newIndex);
        setHiddenCardId(projects[newIndex]?.id || null);
    };

    const defaultGradient = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)';
    const backBg = gradient || defaultGradient;
    const tabBg = gradient || 'var(--primary-dark)';
    const frontBg = gradient || defaultGradient;

    // Extract a color from the gradient for the glow
    const glowColor = useMemo(() => {
        if (!gradient) return 'var(--primary)';
        const match = gradient.match(/#[a-fA-F0-9]{3,6}/);
        return match ? match[0] : 'var(--primary)';
    }, [gradient]);

    return (
        <>
            <div
                className={cn(styles.folderContainer, className)}
                style={{
                    transform: isHovered ? 'scale(1.04) rotate(-1.5deg)' : 'scale(1) rotate(0deg)',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow */}
                <div
                    className={styles.folderGlow}
                    style={{
                        background: `radial-gradient(circle at 50% 70%, ${glowColor} 0%, transparent 70%)`,
                        opacity: isHovered ? 0.12 : 0,
                    }}
                />

                <div className={styles.folderVisual}>
                    {/* Back */}
                    <div
                        className={styles.folderBack}
                        style={{
                            background: backBg,
                            filter: gradient ? 'brightness(0.9)' : 'none',
                            transform: isHovered ? 'rotateX(-20deg) scaleY(1.05)' : 'rotateX(0deg) scaleY(1)',
                        }}
                    />
                    {/* Tab */}
                    <div
                        className={styles.folderTab}
                        style={{
                            background: tabBg,
                            filter: gradient ? 'brightness(0.85)' : 'none',
                            transform: isHovered ? 'rotateX(-30deg) translateY(-3px)' : 'rotateX(0deg) translateY(0)',
                        }}
                    />
                    {/* Project preview cards */}
                    <div className={styles.projectCardsAnchor}>
                        {previewProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                ref={(el) => { cardRefs.current[index] = el; }}
                                image={project.image}
                                title={project.title}
                                delay={index * 50}
                                isVisible={isHovered}
                                index={index}
                                totalCount={previewProjects.length}
                                onClick={() => handleProjectClick(project, index)}
                                isSelected={hiddenCardId === project.id}
                            />
                        ))}
                    </div>
                    {/* Front */}
                    <div
                        className={styles.folderFront}
                        style={{
                            background: frontBg,
                            transform: isHovered ? 'rotateX(35deg) translateY(12px)' : 'rotateX(0deg) translateY(0)',
                        }}
                    />
                    {/* Front shine */}
                    <div
                        className={styles.folderFrontShine}
                        style={{
                            transform: isHovered ? 'rotateX(35deg) translateY(12px)' : 'rotateX(0deg) translateY(0)',
                        }}
                    />
                </div>

                <div className={styles.folderInfo}>
                    <h3
                        className={styles.folderTitle}
                        style={{
                            transform: isHovered ? 'translateY(2px)' : 'translateY(0)',
                            letterSpacing: isHovered ? '-0.01em' : '0',
                        }}
                    >
                        {title}
                    </h3>
                    <p className={styles.folderCount} style={{ opacity: isHovered ? 0.8 : 1 }}>
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                    </p>
                </div>

                <div
                    className={styles.folderHint}
                    style={{
                        opacity: isHovered ? 0 : 1,
                        transform: isHovered ? 'translateX(-50%) translateY(10px)' : 'translateX(-50%) translateY(0)',
                    }}
                >
                    <span>Hover</span>
                </div>
            </div>

            <ImageLightbox
                projects={projects}
                currentIndex={selectedIndex ?? 0}
                isOpen={selectedIndex !== null}
                onClose={handleCloseLightbox}
                sourceRect={sourceRect}
                onCloseComplete={handleCloseComplete}
                onNavigate={handleNavigate}
            />
        </>
    );
};

export default AnimatedFolder;

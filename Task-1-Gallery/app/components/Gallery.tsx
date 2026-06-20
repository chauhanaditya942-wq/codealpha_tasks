"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Gallery.module.css";
import { CATEGORIES, GALLERY_IMAGES, type Category, type GalleryImage } from "./Gallery.types";
import { useMasonry } from "./useMasonry";

type SortMode = "newest" | "category" | "shuffle";

export default function Gallery() {
  // ---- Core data state ----
  const [images, setImages] = useState<GalleryImage[]>(GALLERY_IMAGES);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  
  // ---- Likes with LocalStorage (Upgrade) ----
  const [likedIds, setLikedIds] = useState<Set<number>>(() => {
    // Persist likes across page reloads
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gallery_likes");
      if (saved) return new Set(JSON.parse(saved));
    }
    return new Set();
  });
  
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  // ---- Toast Notification (Upgrade) ----
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const addToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // ---- Lightbox state ----
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- Upload state ----
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync likes to localStorage
  useEffect(() => {
    localStorage.setItem("gallery_likes", JSON.stringify([...likedIds]));
  }, [likedIds]);

  // ---------------------------------------------------------------------
  // Derived: filter -> search -> sort pipeline
  // ---------------------------------------------------------------------
  const processedImages = useMemo(() => {
    let list = images;

    if (activeCategory !== "All") {
      list = list.filter((img) => img.category === activeCategory);
    }

    if (showLikedOnly) {
      list = list.filter((img) => likedIds.has(img.id));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (img) =>
          img.title.toLowerCase().includes(q) ||
          img.category.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sortMode === "newest") {
      sorted.sort((a, b) => b.dateAdded - a.dateAdded);
    } else if (sortMode === "category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortMode === "shuffle") {
      const seeded = sorted.map((img, i) => ({
        img,
        rand: Math.abs(Math.sin(img.id * 999 + shuffleSeed * 137 + i)),
      }));
      seeded.sort((a, b) => a.rand - b.rand);
      return seeded.map((s) => s.img);
    }
    return sorted;
  }, [images, activeCategory, searchQuery, sortMode, shuffleSeed, showLikedOnly, likedIds]);

  const featured = processedImages[0];
  const restImages = useMemo(() => processedImages.slice(1), [processedImages]);

  // ---------------------------------------------------------------------
  // JS-calculated masonry
  // ---------------------------------------------------------------------
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w <= 460) setColumnCount(1);
      else if (w <= 760) setColumnCount(2);
      else if (w <= 1100) setColumnCount(3);
      else setColumnCount(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const { columns, registerHeight } = useMasonry(restImages, columnCount);

  const handleImageMeasure = useCallback(
    (id: number, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth && img.naturalHeight) {
        registerHeight(id, img.naturalWidth / img.naturalHeight);
      }
    },
    [registerHeight]
  );

  const handleImageLoad = useCallback(
    (id: number, e: React.SyntheticEvent<HTMLImageElement>) => {
      handleImageMeasure(id, e);
      setLoadedIds((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    [handleImageMeasure]
  );

  // ---------------------------------------------------------------------
  // Lightbox controls
  // ---------------------------------------------------------------------
  const openLightbox = (index: number) => {
    setIsImageLoading(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setIsAutoplay(false);
  }, []);

  const resetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const showNext = useCallback(() => {
    setIsImageLoading(true);
    resetZoomPan();
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % processedImages.length;
    });
  }, [processedImages.length]);

  const showPrev = useCallback(() => {
    setIsImageLoading(true);
    resetZoomPan();
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + processedImages.length) % processedImages.length;
    });
  }, [processedImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoplay((a) => !a);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= processedImages.length) {
      setLightboxIndex(null);
    }
  }, [processedImages.length, lightboxIndex]);

  useEffect(() => {
    if (isAutoplay && lightboxIndex !== null) {
      autoplayTimerRef.current = setInterval(() => {
        showNext();
      }, 2800);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplay, lightboxIndex, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;
    if (deltaX > SWIPE_THRESHOLD) showPrev();
    else if (deltaX < -SWIPE_THRESHOLD) showNext();
    touchStartX.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.0015;
      return Math.min(3, Math.max(1, next));
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetZoomPan();
    } else {
      setZoom(2);
    }
  };

  // ---------------------------------------------------------------------
  // Likes & Toast Feedback
  // ---------------------------------------------------------------------
  const toggleLike = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addToast("Removed from favorites");
      } else {
        next.add(id);
        addToast("Added to favorites");
      }
      return next;
    });
  };

  // ---------------------------------------------------------------------
  // Upload & Delete (Upgrade)
  // ---------------------------------------------------------------------
  const addFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const newEntries: GalleryImage[] = imageFiles.map((file, i) => ({
      id: Date.now() + i,
      src: URL.createObjectURL(file),
      alt: file.name,
      category: "Nature",
      title: file.name.replace(/\.[^/.]+$/, ""),
      dateAdded: Date.now() + i,
      isUploaded: true,
    }));

    setImages((prev) => [...newEntries, ...prev]);
    addToast(`${imageFiles.length} image(s) uploaded successfully!`);
  };

  const handleDeleteImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((img) => img.id !== id));
    addToast("Image deleted");
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const activeImage = lightboxIndex !== null ? processedImages[lightboxIndex] : null;

  return (
    <section
      className={styles.wrapper}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toast Container (Upgrade) */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={styles.toast}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </div>

      {isDraggingFile && (
        <div className={styles.dropOverlay}>
          <div className={`${styles.dropOverlayInner} ${styles.dropPulse}`}>
            <span className={styles.dropIcon}>+</span>
            <p>Drop images to add them to the gallery</p>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <p className={styles.eyebrow}>Selected Frames</p>
        <h1 className={styles.title}>The Gallery</h1>
      </header>

      {/* ---------------- Controls bar ---------------- */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.controlsRight}>
          <select
            className={styles.sortSelect}
            value={sortMode}
            onChange={(e) => {
              const mode = e.target.value as SortMode;
              setSortMode(mode);
              if (mode === "shuffle") setShuffleSeed((s) => s + 1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="category">By Category</option>
            <option value="shuffle">Shuffle</option>
          </select>

          <button
            type="button"
            className={`${styles.iconToggle} ${showLikedOnly ? styles.iconToggleActive : ""}`}
            onClick={() => setShowLikedOnly((v) => !v)}
            aria-pressed={showLikedOnly}
            title="Show liked only"
          >
            <HeartIcon filled={showLikedOnly} /> {likedIds.size}
          </button>

          <button type="button" className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
            + Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileInputChange} />
        </div>
      </div>

      <div className={styles.filterRow} role="tablist" aria-label="Filter images by category">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={activeCategory === category}
            className={`${styles.filterPill} ${activeCategory === category ? styles.filterPillActive : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ---------------- Featured hero ---------------- */}
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key={featured.id}
            className={styles.featured}
            onClick={() => openLightbox(0)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <img src={featured.src} alt={featured.alt} className={styles.featuredImage} />
            <div className={styles.featuredGrain} />
            <div className={styles.featuredOverlay}>
              <span className={styles.featuredCategory}>{featured.category}</span>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
            </div>
            <button
              className={`${styles.likeButton} ${styles.likeButtonFeatured}`}
              onClick={(e) => toggleLike(featured.id, e)}
              aria-label="Toggle like"
            >
              <HeartIcon filled={likedIds.has(featured.id)} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- JS-calculated masonry grid ---------------- */}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
        {columns.map((col, colIndex) => (
          <div key={colIndex} className={styles.column}>
            <AnimatePresence>
              {col.map((image) => {
                const globalIndex = processedImages.findIndex((i) => i.id === image.id);
                return (
                  <motion.figure
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={styles.card}
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <div className={styles.imageFrame}>
                      {/* Shimmer Skeleton Placeholder — sirf load tak render */}
                      {!loadedIds.has(image.id) && <div className={styles.shimmerSkeleton} />}
                      
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={styles.image}
                        loading="lazy"
                        onLoad={(e) => handleImageLoad(image.id, e)}
                      />
                      <div className={styles.grain} />
                      <div className={styles.overlay}>
                        <span className={styles.overlayCategory}>{image.category}</span>
                        <span className={styles.overlayTitle}>{image.title}</span>
                      </div>
                      <div className={styles.cornerMark} />
                      <button
                        className={styles.likeButton}
                        onClick={(e) => toggleLike(image.id, e)}
                        aria-label="Toggle like"
                      >
                        <HeartIcon filled={likedIds.has(image.id)} />
                      </button>
                      {image.isUploaded && (
                        <>
                          <span className={styles.uploadedBadge}>Yours</span>
                          {/* Delete Button (Upgrade) */}
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => handleDeleteImage(image.id, e)}
                            aria-label="Delete image"
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.figure>
                );
              })}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {processedImages.length === 0 && (
        <p className={styles.emptyState}>
          {showLikedOnly ? "You haven't liked anything in this view yet." : "No images match your search."}
        </p>
      )}

      {/* ---------------- Lightbox ---------------- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            className={styles.lightboxBackdrop}
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className={styles.closeButton} onClick={closeLightbox} aria-label="Close lightbox">
                &times;
              </button>

              <button className={`${styles.navButton} ${styles.navButtonPrev}`} onClick={showPrev} aria-label="Previous image">
                &#8249;
              </button>

              <div
                className={styles.lightboxImageWrap}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onDoubleClick={handleDoubleClick}
                style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
              >
                {isImageLoading && <div className={styles.spinner} />}
                <img
                  key={activeImage.id}
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className={`${styles.lightboxImage} ${isImageLoading ? styles.lightboxImageHidden : ""}`}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isDraggingRef.current ? "none" : "transform 0.2s ease",
                  }}
                  onLoad={() => setIsImageLoading(false)}
                  draggable={false}
                />
              </div>

              <button className={`${styles.navButton} ${styles.navButtonNext}`} onClick={showNext} aria-label="Next image">
                &#8250;
              </button>

              <div className={styles.lightboxCaption}>
                <button
                  className={styles.lightboxLikeButton}
                  onClick={(e) => toggleLike(activeImage.id, e)}
                  aria-label="Toggle like"
                >
                  <HeartIcon filled={likedIds.has(activeImage.id)} />
                </button>
                <span className={styles.lightboxTitle}>{activeImage.title}</span>
                <button
                  className={`${styles.autoplayButton} ${isAutoplay ? styles.autoplayButtonActive : ""}`}
                  onClick={() => setIsAutoplay((a) => !a)}
                  aria-label="Toggle slideshow"
                  title="Play / pause slideshow (space)"
                >
                  {isAutoplay ? <PauseIcon /> : <PlayIcon />}
                </button>
                <span className={styles.lightboxCounter}>
                  {lightboxIndex! + 1} / {processedImages.length}
                </span>
              </div>
              {zoom > 1 && <span className={styles.zoomHint}>Drag to pan · double-click to reset</span>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------- Icons ----------------
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path
        d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4.5c2 0 3.4 1 4.4 2.5 1-1.5 2.4-2.5 4.4-2.5C18 4.5 19.5 8 22 11.7 19.5 16.3 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4l15 8-15 8V4z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="5" height="16" />
      <rect x="14" y="4" width="5" height="16" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}
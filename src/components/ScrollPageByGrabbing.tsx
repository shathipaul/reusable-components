import { useState, useRef, useEffect } from "react";

const ScrollPageByGrabbing = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null); // Explicitly typed as HTMLDivElement
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    // Start dragging
    isDownRef.current = true;
    setIsDragging(true);
    startXRef.current =
      e.clientX - sliderRef.current.getBoundingClientRect().left;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const stopDrag = () => {
    isDownRef.current = false;
    setIsDragging(false);
  };

  const handleDragging = (e: MouseEvent) => {
    if (!isDownRef.current) return;

    // Prevent default behavior to avoid text selection
    e.preventDefault();

    if (!sliderRef.current) return;

    // Get the current mouse position relative to the container
    const x = e.clientX - sliderRef.current.getBoundingClientRect().left;
    const walk = (x - startXRef.current) * 2; // Adjust speed if necessary
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  useEffect(() => {
    // Attach mousemove, mouseup, and mouseleave to document for global handling
    const handleMouseMove = (e: MouseEvent) => handleDragging(e);
    const handleMouseUp = () => stopDrag();
    const handleMouseLeave = () => stopDrag();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={sliderRef}
      onMouseDown={startDrag}
      className={`overflow-x-auto whitespace-nowrap h-screen bg-slate-600 p-12 ${
        isDragging ? "cursor-grabbing select-none" : "cursor-grab"
      }`}
    >
      <div className="flex gap-5 h-full">
        {Array.from({ length: 500 }, (_, i) => (
          <p key={i} className="bg-white min-w-[400px] whitespace-nowrap">
            {`Item ${i + 1}`}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ScrollPageByGrabbing;

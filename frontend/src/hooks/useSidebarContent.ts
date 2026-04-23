import { useState, useCallback, useRef } from "react";

type ContentType = "lender" | "insight" | "rate" | "eligibility";

export function useSidebarContent() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleItemClick = useCallback((slug: string, type: ContentType) => {
    setSelectedSlug(slug);
    setSelectedType(type);
    // Scroll to content panel
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedSlug(null);
    setSelectedType(null);
  }, []);

  return { selectedSlug, selectedType, handleItemClick, handleClose, contentRef };
}

import { useRef, useEffect, useCallback } from "react";
import Loading from "@shared/components/Loading";
import { useFetchTags } from "./hooks/useFetchTags";
import { useDarkMode } from "../../components/DarkModeContext";
import { Button, Tag } from "@shared/components/Buttons";
import { useAuth } from "../../modules/auth";
import { useModalManager } from "@shared/components/Modals";
import AddTagModal from "./components/AddTagModal";

function Tags() {
  const { isDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModalManager();
  const { tags, loading, hasMore, loadMoreTags } = useFetchTags();
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  loadMoreTags();

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMoreTags();
    }
  }, [hasMore, loading, loadMoreTags]);

  const handleAddTag = () => {
    openModal(<AddTagModal onCancel={closeModal} onAddTag={closeModal}/> )
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "80vh",
        overflowY: "auto",
        scrollbarColor: isDarkMode ? "#666 #2c2c2c" : "#ccc #f0f0f0",
      }}
      className="max-w-5xl mx-auto p-6 flex flex-col items-center text-center transition-all duration-300"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Tags
      </h1>

      {isAuthenticated && (
        <Button btnType="primary" className="mb-6" onClick={handleAddTag}>
          + New Tag
        </Button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {tags.map((tag) => (
          <Tag key={tag.id} isReadOnly={false} title={tag.title} />
        ))}
      </div>

      {loading && <Loading className="mt-6" />}

      {!hasMore && !loading && (
        <div className="text-gray-500 mt-6 animate-fade-in">
          You’ve reached the end! No more tags to load.
        </div>
      )}

      {hasMore && <div ref={observerRef} className="h-1"></div>}
    </div>
  );
}

export default Tags;

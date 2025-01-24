import React, { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useFetchCollections } from "./useFetchCollections";
import { Button } from "@shared/components/Buttons";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Collection } from "@shared/models/Collection";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { useAuth } from "../../auth";

const Collections: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { collections, loading, hasMore, loadMoreCollections } =
    useFetchCollections();

  const observerRef = useRef<HTMLDivElement | null>(null);
  loadMoreCollections();

  // Function to load more recipes when user scrolls near bottom
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMoreCollections();
    }
  }, [hasMore, loading, loadMoreCollections]);

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
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center text-center transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-leaf-green-100 mb-4">
        My Recipe Collections
      </h1>
      <p className="text-gray-600 mb-6">
        A collection is like a <strong>recipe book</strong> where you can{" "}
        <strong>organize recipes, share them</strong> with others, or{" "}
        <strong>keep them private</strong>.
      </p>

      {isAuthenticated && (
        <Link to={`add-new`}>
          <Button btnType="primary" className="mb-6">
            + New Collection
          </Button>
        </Link>
      )}

      {loading && <Loading className="mt-6" />}

      {!loading && collections.length === 0 && (
        <EmptyState message="You don't have any collections yet. Create one now!" />
      )}

      {collections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
          {collections.map((collection: Collection) => (
            <Link key={collection.id} to={`${collection.id}`}>
              <ImgTitleDescription
                title={collection.title}
                description={collection.description}
                img_url={collection.img_url}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;

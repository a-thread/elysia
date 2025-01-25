import React, { useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchCollections } from "./useFetchCollections";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Collection } from "@shared/models/Collection";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import TitleDescHeader from "@shared/components/TitleDescHeader";

const CollectionList: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center transition-all duration-300">
      <div className="w-full">
        <TitleDescHeader
          title="Collections"
          actionName="+ New Collection"
          classes="mb-2"
          onAction={() => navigate("add-new")}
        />
        <p className="text-gray-600 mb-4">
          A collection is like a <strong>recipe book</strong> where you can{" "}
          <strong>organize recipes, share them</strong> with others, or{" "}
          <strong>keep them private</strong>.
        </p>
      </div>

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

export default CollectionList;

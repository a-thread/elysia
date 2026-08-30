import React, { useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchCollections } from "./useFetchCollections";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Collection } from "@shared/models/Collection";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import InfiniteScroll from "@shared/components/InfiniteScroll";
import { useAuth } from "@shared/contexts/AuthContext";
import { FaPlus } from "react-icons/fa6";

const CollectionList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { collections, loading, hasMore, loadMoreCollections } =
    useFetchCollections();

  useEffect(() => {
    loadMoreCollections();
    // Mount-only fetch of the first page; loadMoreCollections isn't memoized
    // and guards against re-entrancy itself via its loading/hasMore checks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInfiniteScroll = useCallback(() => {
    if (!loading && hasMore) {
      loadMoreCollections();
    }
  }, [hasMore, loading, loadMoreCollections]);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col justify-center items-center transition-all duration-300">
      <div className="w-full">
        <TitleDescHeader
          title="Collections"
          actionName="New Collection"
          actionVariant="solid"
          classes="mb-2"
          onAction={() => navigate("add-new")}
        />
        <p className="text-gray-600 dark:text-leaf-green-100 mb-4">
          A collection is like a <strong>recipe book</strong> where you can{" "}
          <strong>organize recipes, share them</strong> with others, or{" "}
          <strong>keep them private</strong>.
        </p>
      </div>

      {loading && <Loading className="mt-6" />}

      {!loading && collections.length === 0 && !isAuthenticated && (
        <EmptyState message="You don't have any collections yet. Create one now!" />
      )}

      {!loading && (collections.length > 0 || isAuthenticated) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-6">
          {collections.map((collection: Collection) => (
            <Link key={collection.id} to={`${collection.id}`}>
              <ImgTitleDescription
                title={collection.title}
                description={collection.description}
                img_url={collection.img_url}
              />
            </Link>
          ))}

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigate("add-new")}
              className="flex flex-col items-center justify-center gap-2 min-h-[172px] p-6 rounded-2xl border-[1.5px] border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-colors hover:border-leaf-green-300 hover:bg-leaf-green-50 dark:hover:border-leaf-green-700 dark:hover:bg-leaf-green-900/20 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf-green-400"
            >
              <FaPlus className="w-6 h-6 text-leaf-green-300" aria-hidden="true" />
              <span className="text-sm font-semibold">New Collection</span>
            </button>
          )}
        </div>
      )}

      {hasMore && (
        <InfiniteScroll threshold={0.1} onScrolled={handleInfiniteScroll}>
          <div className="h-1" />
        </InfiniteScroll>
      )}
    </div>
  );
};

export default CollectionList;

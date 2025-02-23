import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchCollections } from "./useFetchCollections";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import { Collection } from "@shared/models/Collection";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import InfiniteScroll from "@shared/components/InfiniteScroll";

const CollectionList: React.FC = () => {
  const navigate = useNavigate();
  const { collections, loading, hasMore, loadMoreCollections } =
    useFetchCollections();

  loadMoreCollections();

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
          actionName="+ New Collection"
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

      {hasMore && (
        <InfiniteScroll threshold={0.1} onScrolled={handleInfiniteScroll}>
          <div className="h-1" />
        </InfiniteScroll>
      )}
    </div>
  );
};

export default CollectionList;

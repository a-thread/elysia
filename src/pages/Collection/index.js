import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../shared/components/Loading";
import EmptyState from "../../shared/components/EmptyState";
import { useAuth } from "../../shared/contexts/AuthContext";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import EllipsisMenu from "./components/EllipsisMenu";
import TitleDescHeader from "../../shared/components/TitleDescHeader";
import CollectionService from "../../shared/services/CollectionService";
import ImgTitleDescription from "../../shared/components/ImgTitleDescCard";
import { Tag } from "../../shared/components/Buttons";

function Collection() {
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch collection details
  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      try {
        const collectionData = await CollectionService.fetchCollectionDetails(
          id,
          user?.id
        );
        setCollection(collectionData);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [id, user?.id]);

  if (loading) {
    return <Loading className="mt-40"></Loading>;
  }

  if (!collection) {
    return <EmptyState message="Collection not found." />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <Link to="/">
          <div className="flex justify-center items-center font-medium text-center text-leafGreen-600 dark:text-leafGreen-100">
            <ChevronLeftIcon aria-hidden="true" className="size-6" />
            <p>Collections</p>
          </div>
        </Link>
        <div className="flex justify-end gap-2">
          {!!user?.id && <EllipsisMenu collection={collection} />}
        </div>
      </div>

      {!!collection?.img_url?.length && (
        <div className="relative">
          <img
            src={collection.img_url}
            alt={collection.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </div>
      )}
      <div
        className={`bg-white dark:bg-gray-900 rounded-b-lg p-6 ${
          !collection?.img_url && "rounded-t-lg"
        }`}
      >
        <TitleDescHeader
          title={collection.title}
          description={collection.description}
        />

        {collection.tags.length > 0 && (
          <>
            <h2 className="pb-2 pt-3 text-xl font-bold text-leafGreen-900 dark:text-leafGreen-100">
              Tags
            </h2>
            <div>
              {collection.tags.map((tag) => (
                <Tag key={tag.id} title={tag.name} isReadOnly={true}></Tag>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {collection.recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
            <ImgTitleDescription
              key={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imgUrl={recipe.img_url}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Collection;

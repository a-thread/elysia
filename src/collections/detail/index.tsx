import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import EllipsisMenu from "./components/EllipsisMenu";
import { useAuth } from "@shared/contexts/AuthContext";
import { Collection as CollectionData } from "@shared/models/Collection";
import CollectionService from "@shared/services/CollectionService";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { TagButton } from "@shared/components/Buttons";
import { useNavigate } from "react-router-dom";

const CollectionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch collection details
  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("no id found");
        }
        const collectionData = await CollectionService.getDetail(id, user?.id);
        if (!collectionData) {
          throw new Error("no data returned");
        }
        setCollection(collectionData);
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [id, user]);

  if (loading) {
    return <Loading className="mt-40" />;
  }

  if (!collection) {
    return <EmptyState message="Collection not found." />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <Link to="/collections">
          <div className="flex justify-center items-center font-medium text-center text-leaf-green-600 dark:text-leaf-green-100">
            <FaChevronLeft aria-hidden="true" className="size-6" />
            <p>Collections</p>
          </div>
        </Link>
        <div className="flex justify-end flex-wrap gap-2">
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

        {collection.tags && collection.tags.length > 0 && (
          <div className="mt-4">
            {collection.tags.map((tag) => (
              <TagButton key={tag.id} title={tag.title} isReadOnly={true}  onClick={() => {
                navigate("/", { state: { selectedTags: [tag] } });
              }}/>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {collection.recipes &&
          collection.recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <ImgTitleDescription
                key={recipe.id}
                title={recipe.title}
                description={recipe.description}
                img_url={recipe.img_url}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CollectionDetail;

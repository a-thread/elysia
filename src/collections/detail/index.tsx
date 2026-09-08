import React from "react";
import { Link, useNavigate } from "react-router-dom";
import EllipsisMenu from "./components/EllipsisMenu";
import Loading from "@shared/components/Loading";
import EmptyState from "@shared/components/EmptyState";
import TitleDescHeader from "@shared/components/TitleDescHeader";
import ImgTitleDescription from "@shared/components/ImgTitleDescCard";
import { TagButton } from "@shared/components/Buttons";
import Card from "@shared/components/Card";
import BackLink from "@shared/components/BackLink";
import { useCollectionDetailPage } from "./hooks/useCollectionDetailPage";

const CollectionDetail: React.FC = () => {
  const navigate = useNavigate();
  const {
    collection,
    loading,
    showMenu,
    canEdit,
    isOwner,
    editCollection,
    confirmDelete,
    isPublic,
    publicPermission,
    sharedUsers,
    toggleIsPublic,
    setPublicPermission,
    shareWithUser,
    revokeAccessById,
    copyLink,
  } = useCollectionDetailPage();

  if (loading) {
    return <Loading className="mt-40" />;
  }

  if (!collection) {
    return <EmptyState message="Collection not found." />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="w-full flex justify-between items-center mb-4">
        <BackLink to="/collections">Collections</BackLink>
        <div className="flex justify-end flex-wrap gap-2">
          {showMenu && (
            <EllipsisMenu
              canEdit={canEdit}
              isOwner={isOwner}
              isPublic={isPublic}
              publicPermission={publicPermission}
              sharedUsers={sharedUsers}
              onEdit={editCollection}
              onDelete={confirmDelete}
              onTogglePublicShare={toggleIsPublic}
              onSetPublicPermission={setPublicPermission}
              shareWithUser={shareWithUser}
              onRevokeAccess={revokeAccessById}
              onCopyLink={copyLink}
            />
          )}
        </div>
      </div>

      {!!collection?.img_url?.length && (
        <div className="relative">
          <img
            src={collection.img_url}
            alt={collection.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
        </div>
      )}
      <Card hasImageAbove={!!collection?.img_url}>
        <TitleDescHeader
          title={collection.title}
          description={collection.description}
        />

        {collection.tags && collection.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <TagButton key={tag.id} title={tag.title} isReadOnly={true}  onClick={() => {
                navigate("/recipes", { state: { selectedTags: [tag] } });
              }}/>
            ))}
          </div>
        )}
      </Card>
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

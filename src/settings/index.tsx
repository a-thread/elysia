import React from "react";
import Loading from "@shared/components/Loading";
import ConnectionCard from "./components/ConnectionCard";
import { useSettingsPage } from "./hooks/useSettingsPage";

const Settings: React.FC = () => {
  const {
    ternEnabled,
    lichenEnabled,
    loading,
    saving,
    toggleTern,
    toggleLichen,
  } = useSettingsPage();

  if (loading) return <Loading className="mt-40" />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-medium text-leaf-green-900 dark:text-leaf-green-100 mb-6">
        Settings
      </h1>
      <div className="flex flex-col gap-4">
        <ConnectionCard
          title="Connect to Tern"
          description={
            <>
              Tern is a health tracker for food, steps and more. When connected,
              recipes that have nutrition facts get a &ldquo;Send to Tern&rdquo;
              option that saves the recipe as a meal in your Tern account.
            </>
          }
          details={[
            "Nothing is sent automatically. You choose each recipe.",
            "It uses the same login, so there is nothing else to set up.",
            "Disconnecting hides the option. Meals you already sent stay in Tern, where you can delete them.",
          ]}
          enabled={ternEnabled}
          disabled={saving !== null}
          onToggle={toggleTern}
        />
        <ConnectionCard
          title="Connect to Lichen"
          description={
            <>
              Lichen is a notes app. When connected, your shopping list is kept
              in a note called &ldquo;Shopping List&rdquo; in your Lichen
              account. Adding, checking off and removing items here updates the
              note.
            </>
          }
          details={[
            "Elysia is the source of truth: changes you make to that note in Lichen are replaced the next time your list changes here.",
            "Turning this on creates the note from your current list.",
            "Disconnecting stops updates. The note stays in Lichen, where you can edit or delete it.",
          ]}
          enabled={lichenEnabled}
          disabled={saving !== null}
          onToggle={toggleLichen}
        />
      </div>
    </div>
  );
};

export default Settings;

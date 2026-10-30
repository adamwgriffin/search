import SavedSearchCard from "@/components/SavedSearchCard/SavedSearchCard";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth_options";
import db from "@/lib/db";
import styles from "./page.module.css";

export default async function SavedSearches() {
  const session = await getServerSession(authOptions);
  const savedSearches = session?.user?.id
    ? await db.SavedSearch.find({ userId: session.user.id })
        .select("name messageCadence searchState")
        .lean()
        // Only plain objects can be passed to client components, so convert
        // the ObjectId to a string
        .transform((docs) =>
          docs.map(({ _id, name, messageCadence, searchState }) => ({
            id: _id.toString(),
            name,
            messageCadence,
            searchState
          }))
        )
    : [];

  return (
    <>
      <h1>Saved Searches</h1>
      <ul className={styles.savedSearchCards}>
        {savedSearches.map((savedSearch) => (
          <li key={savedSearch.id}>
            <SavedSearchCard savedSearch={savedSearch} />
          </li>
        ))}
      </ul>
    </>
  );
}

import SavedSearchCard from "@/components/SavedSearchCard/SavedSearchCard";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth_options";
import prisma from "@/lib/prismadb";
import styles from "./page.module.css";

export default async function SavedSearches() {
  const session = await getServerSession(authOptions);
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      userId: session?.user?.id
    }
  });

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

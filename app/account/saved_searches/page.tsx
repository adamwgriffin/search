import MinimalHeader from "@/components/header/MinimalHeader/MinimalHeader";
import AccountBody from "@/components/AccountBody/AccountBody";
import SavedSearchCard from "@/components/SavedSearchCard/SavedSearchCard";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth_options";
import prisma from "@/lib/prismadb";
import styles from "./page.module.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export default async function SavedSearches() {
  const session = await getServerSession(authOptions);
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      userId: session?.user?.id
    }
  });

  return (
    <ReactQueryClientProvider>
      <MinimalHeader />
      <AccountBody>
        <h1>Saved Searches</h1>
        <ul className={styles.savedSearchCards}>
          {savedSearches.map((savedSearch) => (
            <li key={savedSearch.id}>
              <SavedSearchCard savedSearch={savedSearch} />
            </li>
          ))}
        </ul>
      </AccountBody>
    </ReactQueryClientProvider>
  );
}

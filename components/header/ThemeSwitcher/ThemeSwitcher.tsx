import { useTheme } from "next-themes";
import styles from "./ThemeSwitcher.module.css";
import Fieldset from "@/components/design_system/Fieldset/Fieldset";
import { useIsHydrated } from "@/hooks/useIsHydrated";

const ThemeSwitcher: React.FC = () => {
  // The theme isn't known on the server, so only render the UI on the client
  const isHydrated = useIsHydrated();
  const { theme, setTheme } = useTheme();

  if (!isHydrated) {
    return null;
  }

  return (
    <Fieldset>
      <div className={styles.themeSwitcher}>
        <label htmlFor="themeswitcher" className={styles.label}>
          Theme:
        </label>
        <select
          id="themeswitcher"
          className={styles.themeSwitcherDropdown}
          name="themeswitcher"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
        </select>
      </div>
    </Fieldset>
  );
};

export default ThemeSwitcher;

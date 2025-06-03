import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import styles from "./ThemeSwitcher.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";

const ThemeSwitcher: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

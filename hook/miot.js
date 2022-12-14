import { useState, useEffect } from 'react';
import DarkMode from 'miot/darkmode';
import { PackageEvent } from 'miot';
export function useDarkMode() {
  const [mode, setMode] = useState(DarkMode.getColorScheme());
  useEffect(() => {
    const listener = (value) => setMode(value.colorScheme);
    const didResume = () => {
      DarkMode.addChangeListener(listener);
      setMode(DarkMode.getColorScheme());
    };
    const willPause = () => {
      DarkMode.removeChangeListener(listener);
    };
    DarkMode.addChangeListener(listener);
    const s1 = PackageEvent.packageDidResume.addListener(didResume);
    const s2 = PackageEvent.packageWillPause.addListener(willPause);
    return () => {
      DarkMode.removeChangeListener(listener);
      s1.remove();
      s2.remove();
    };
  }, []);
  return mode;
}

/**
 * @template T
 * @param {T} light 
 * @param {T} dark 
 * @returns T
 */
export function useDarkValues(light, dark) {
  const mode = useDarkMode();
  return mode === 'dark' ? dark : light;
}
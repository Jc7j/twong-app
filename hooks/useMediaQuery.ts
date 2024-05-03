import { useEffect, useState } from 'react'

export function useMediaQuery(queryString: string): boolean | undefined {
  const [isMatch, setIsMatch] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mediaQuery = window.matchMedia(queryString)

    function onChange() {
      setIsMatch(mediaQuery.matches)
    }

    // The newer standard is to use `addEventListener` with `matchMedia`
    // But some older browsers might not support this, hence fallback might be needed.
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(onChange)
    }

    onChange()

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', onChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(onChange)
      }
    }
  }, [queryString])

  return isMatch
}

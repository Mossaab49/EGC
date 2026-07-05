import { parseWordList } from '../lib/wordle.js'

const DICTIONARY_PATHS = ['/assets/words.txt', '/dist/assets/words.txt']

/**
 * Loads the static English dictionary from public assets. It is intentionally
 * wrapped as a service so a future backend endpoint can replace this function
 * without touching the Wordle component.
 */
export async function loadEnglishDictionary(fetchImpl = fetch) {
  for (const path of DICTIONARY_PATHS) {
    try {
      const response = await fetchImpl(path)
      if (!response.ok) continue

      const words = parseWordList(await response.text())
      if (words.length) return words
    } catch {
      // The caller keeps its fallback dictionary if assets are unavailable.
    }
  }

  return []
}

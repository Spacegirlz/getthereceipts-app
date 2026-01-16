/**
 * Persistent storage for conversation speaker mappings
 * 
 * Stores color-to-name mappings in conversationSpeakers.json
 * for reuse across sessions and to improve confidence.
 */

/**
 * Load speaker mappings from persistent storage
 * @returns {Promise<Object>} Map of conversation IDs to speaker mappings
 */
export async function loadSpeakerMappings() {
  try {
    // In browser: use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('conversationSpeakers');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    // In Node.js: use file system (for server-side)
    // This would require fs module, but for now we'll use localStorage
    return {};
  } catch (error) {
    console.warn('Failed to load speaker mappings:', error);
    return {};
  }
}

/**
 * Save speaker mapping to persistent storage
 * @param {string} conversationId - Unique conversation ID
 * @param {Object} mapping - Speaker mapping { color: name }
 */
export async function saveSpeakerMapping(conversationId, mapping) {
  try {
    const allMappings = await loadSpeakerMappings();
    allMappings[conversationId] = {
      mapping,
      timestamp: Date.now()
    };
    
    // In browser: use localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('conversationSpeakers', JSON.stringify(allMappings));
    }
    
    console.log('✅ Saved speaker mapping for conversation:', conversationId);
  } catch (error) {
    console.warn('Failed to save speaker mapping:', error);
  }
}

/**
 * Get speaker mapping for a conversation
 * @param {string} conversationId - Unique conversation ID
 * @returns {Promise<Object|null>} Speaker mapping or null if not found
 */
export async function getSpeakerMapping(conversationId) {
  try {
    const allMappings = await loadSpeakerMappings();
    return allMappings[conversationId]?.mapping || null;
  } catch (error) {
    console.warn('Failed to get speaker mapping:', error);
    return null;
  }
}


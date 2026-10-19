import { FormationDefinition } from '../../shared/types/index.js';
import { validateCustomFormation } from '../../shared/constants/formations.js';

const STORAGE_KEY = 'football_draft_custom_formations';

/**
 * Retrieves all saved custom formations from localStorage.
 */
export function getCustomFormations(): FormationDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is FormationDefinition => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        Array.isArray(item.slots) &&
        validateCustomFormation(item.slots).valid
      );
    });
  } catch (err) {
    console.error('Failed to load custom formations from localStorage:', err);
    return [];
  }
}

/**
 * Saves or updates a custom formation in localStorage.
 */
export function saveCustomFormation(formation: FormationDefinition): boolean {
  try {
    const validation = validateCustomFormation(formation.slots);
    if (!validation.valid) {
      console.error('Cannot save invalid formation:', validation.reason);
      return false;
    }

    const formations = getCustomFormations();
    const existingIndex = formations.findIndex((f) => f.id === formation.id);

    const formationToSave: FormationDefinition = {
      ...formation,
      isCustom: true,
    };

    if (existingIndex >= 0) {
      formations[existingIndex] = formationToSave;
    } else {
      formations.push(formationToSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formations));
    return true;
  } catch (err) {
    console.error('Failed to save custom formation to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a custom formation by its ID from localStorage.
 */
export function deleteCustomFormation(id: string): boolean {
  try {
    const formations = getCustomFormations();
    const updated = formations.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to delete custom formation from localStorage:', err);
    return false;
  }
}


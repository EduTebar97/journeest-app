
import { Answer, Question } from '../types';

/**
 * Checks if a given answer is valid based on its type and content.
 * An answer is considered invalid if it is:
 * - undefined or null
 * - An empty string or a string with only whitespace.
 * - An empty array.
 * - For 'dynamic_list' questions, an array where every item's 'value' is empty.
 * Numbers (including 0) are considered valid.
 * @param answer The answer to validate.
 * @param question The question context, used for specific validation like for dynamic_list.
 * @returns True if the answer is valid, false otherwise.
 */
export const isAnswerValid = (answer: Answer | undefined | null, question?: Question): boolean => {
    if (answer === undefined || answer === null) {
        return false;
    }

    // A number is always considered a valid answer, including 0.
    if (typeof answer === 'number') {
        return true;
    }

    // A non-empty string is valid.
    if (typeof answer === 'string') {
        return answer.trim() !== '';
    }

    if (Array.isArray(answer)) {
        // An empty array is invalid.
        if (answer.length === 0) {
            return false;
        }

        // Specific check for dynamic_list: if all items are empty, it's invalid.
        if (question?.type === 'dynamic_list') {
            const allItemsAreEffectivelyEmpty = (answer as Array<{ value: string }>).every(
                item => typeof item !== 'object' || !item.value || item.value.trim() === ''
            );
            if (allItemsAreEffectivelyEmpty) {
                return false;
            }
        }
        
        // If the array is not empty (and not an all-empty dynamic list), it's valid.
        return true;
    }

    // In case of an unknown type, treat as invalid.
    return false;
};

// ─── Draw Service ─────────────────────────────────────────────────────────────
// Pure calculation logic — no Express or Supabase dependencies here.

const NUMBERS_PER_ENTRY = 5;
const NUMBER_MAX = 45;

/**
 * Generate `count` unique random integers in [1, max], sorted ascending.
 */
export function generateWinningNumbers(count = NUMBERS_PER_ENTRY, max = NUMBER_MAX) {
    const pool = new Set();
    while (pool.size < count) {
        pool.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(pool).sort((a, b) => a - b);
}

/**
 * Count how many numbers in `entryNumbers` appear in `winningNumbers`.
 */
export function countMatches(entryNumbers, winningNumbers) {
    const winningSet = new Set(winningNumbers);
    return entryNumbers.filter((n) => winningSet.has(n)).length;
}

/**
 * Given a list of draw entries and the winning numbers, return:
 *  {
 *    FIVE_MATCH:  [{ entry_id, user_id, matches }],
 *    FOUR_MATCH:  [...],
 *    THREE_MATCH: [...],
 *  }
 */
export function categoriseWinners(entries, winningNumbers) {
    const buckets = {
        FIVE_MATCH: [],
        FOUR_MATCH: [],
        THREE_MATCH: [],
    };

    for (const entry of entries) {
        const entryNumbers = Array.isArray(entry.entry_numbers)
            ? entry.entry_numbers
            : JSON.parse(entry.entry_numbers);

        const matches = countMatches(entryNumbers, winningNumbers);

        if (matches === 5) buckets.FIVE_MATCH.push({ entry_id: entry.id, user_id: entry.user_id, matches });
        else if (matches === 4) buckets.FOUR_MATCH.push({ entry_id: entry.id, user_id: entry.user_id, matches });
        else if (matches === 3) buckets.THREE_MATCH.push({ entry_id: entry.id, user_id: entry.user_id, matches });
    }

    return buckets;
}

/**
 * Prize split percentages — must sum to 100.
 */
export const PRIZE_SPLIT = {
    FIVE_MATCH: 40,
    FOUR_MATCH: 35,
    THREE_MATCH: 25,
};

/**
 * Build prize_allocation rows for each match type.
 * Returns an array of objects ready to insert into prize_allocations.
 */
export function buildPrizeAllocations(drawId, prizePool, winnerBuckets) {
    return Object.entries(PRIZE_SPLIT).map(([matchType, pct]) => {
        const poolAmount = (prizePool * pct) / 100;
        const winnerCount = winnerBuckets[matchType].length;
        const amountPerWinner = winnerCount > 0 ? poolAmount / winnerCount : 0;

        return {
            draw_id: drawId,
            match_type: matchType,
            percentage: pct,
            pool_amount: Number(poolAmount.toFixed(2)),
            winner_count: winnerCount,
            amount_per_winner: Number(amountPerWinner.toFixed(2)),
        };
    });
}

/**
 * Validate that entry_numbers is an array of NUMBERS_PER_ENTRY unique
 * integers in [1, NUMBER_MAX].
 * Returns an error string, or null if valid.
 */
export function validateEntryNumbers(numbers) {
    if (!Array.isArray(numbers) || numbers.length !== NUMBERS_PER_ENTRY) {
        return `entry_numbers must be an array of exactly ${NUMBERS_PER_ENTRY} numbers.`;
    }
    const unique = new Set(numbers);
    if (unique.size !== NUMBERS_PER_ENTRY) {
        return "entry_numbers must not contain duplicates.";
    }
    for (const n of numbers) {
        if (!Number.isInteger(n) || n < 1 || n > NUMBER_MAX) {
            return `Each number must be an integer between 1 and ${NUMBER_MAX}.`;
        }
    }
    return null;
}

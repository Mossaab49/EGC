import { players, weeklyPlayers } from '../lib/mock-data/index.js'
import { successResponse } from './service-response.js'

/**
 * @param {import('../types/domain.js').RankingRow} row
 * @returns {import('../types/domain.js').RankingRow}
 */
const cloneRankingRow = (row) => [...row]

/**
 * Returns the current monthly and weekly ranking rows.
 *
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Rankings>>}
 */
export async function getRankings() {
  return Promise.resolve(successResponse({
    monthly: players.map(cloneRankingRow),
    weekly: weeklyPlayers.map(cloneRankingRow),
  }))
}

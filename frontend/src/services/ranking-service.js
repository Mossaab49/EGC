import { apiRequest } from './api-client.js'
import { successResponse } from './service-response.js'

/**
 * @param {import('../types/domain.js').RankingRow} row
 * @returns {import('../types/domain.js').RankingRow}
 */
const cloneRankingRow = (row) => [...row]

/**
 * @param {import('../types/domain.js').RankingPeriod} period
 * @returns {Promise<import('../types/domain.js').RankingRow[]>}
 */
async function getRanking(period) {
  const rows = await apiRequest(`/ranking?period=${period}`)
  return rows.map(cloneRankingRow)
}

/**
 * Returns the current monthly and weekly ranking rows from the backend.
 *
 * @returns {Promise<import('../types/domain.js').ApiResponse<import('../types/domain.js').Rankings>>}
 */
export async function getRankings() {
  const [monthly, weekly] = await Promise.all([
    getRanking('monthly'),
    getRanking('weekly'),
  ])

  return successResponse({ monthly, weekly })
}

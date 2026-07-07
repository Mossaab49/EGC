/**
 * @typedef {'Admin' | 'Membre'} UserRole
 * @typedef {'Actif' | 'Invite'} MemberStatus
 * @typedef {'A venir' | 'Passe' | 'Brouillon'} EventStatus
 * @typedef {'Actif' | 'Brouillon' | 'Termine'} TournamentStatus
 * @typedef {'Acceptee' | 'Refusee' | 'En attente'} RequestStatus
 * @typedef {'home' | 'events' | 'activities' | 'account' | 'ranking' | 'admin'} PageId
 * @typedef {'overview' | 'members' | 'wordle' | 'events' | 'tournaments' | 'minecraft'} AdminTabId
 * @typedef {'correct' | 'present' | 'absent'} WordleLetterStatus
 * @typedef {'gold' | 'purple' | 'blue' | 'slate'} PlayerTone
 * @typedef {'monthly' | 'weekly'} RankingPeriod
 * @typedef {[string, string, string, number, PlayerTone]} RankingRow
 */

/**
 * @typedef {object} Member
 * @property {string=} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {number} points
 * @property {MemberStatus} status
 * @property {string=} password
 * @property {string=} passwordUpdatedAt
 * @property {boolean=} mustChangePassword
 */

/**
 * @typedef {object} EventItem
 * @property {string} id
 * @property {string} title
 * @property {string} date
 * @property {string} venue
 * @property {string} imageUrl
 * @property {EventStatus} status
 * @property {string} category
 * @property {string} details
 * @property {string} rules
 * @property {string} postUrl
 * @property {boolean} isSignupOpen
 */

/**
 * @typedef {object} Tournament
 * @property {string} id
 * @property {string} title
 * @property {string} game
 * @property {string} date
 * @property {number} capacity
 * @property {number} registered
 * @property {TournamentStatus} status
 * @property {string} reward
 * @property {string} format
 * @property {string} imageUrl
 */

/**
 * @typedef {object} ToastMessage
 * @property {string} title
 * @property {string} copy
 */

/**
 * @typedef {object} WordleAttempt
 * @property {string} guess
 * @property {string} answer
 * @property {WordleLetterStatus[]} statuses
 * @property {boolean} isCorrect
 */

/**
 * @typedef {object} MinecraftRequest
 * @property {string} name
 * @property {string} launcher
 * @property {RequestStatus} status
 */

/**
 * @typedef {object} Rankings
 * @property {RankingRow[]} monthly
 * @property {RankingRow[]} weekly
 */

/**
 * @template T
 * @typedef {object} ApiResponse
 * @property {boolean} ok
 * @property {T} data
 * @property {string | null} error
 */

/**
 * @typedef {object} AuthUser
 * @property {string=} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {boolean=} mustChangePassword
 */

/**
 * @typedef {object} BackendAuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'ADMIN' | 'MEMBER'} role
 * @property {boolean} mustChangePassword
 */

/**
 * @typedef {object} AuthSession
 * @property {string} accessToken
 * @property {AuthUser} user
 */

/**
 * @typedef {object} AuthContextValue
 * @property {AuthUser | null} user
 * @property {string | null} token
 * @property {(email: string, password: string) => Promise<AuthUser>} login
 * @property {(currentPassword: string, newPassword: string) => Promise<AuthUser>} changePassword
 * @property {() => void} logout
 */

/**
 * @typedef {object} ToastContextValue
 * @property {(payload: ToastMessage) => void} toast
 * @property {ToastMessage | null} toastState
 */

/**
 * @typedef {object} AppDataContextValue
 * @property {boolean} isLoading
 * @property {Member[]} members
 * @property {(member: Member) => Promise<Member>} createMember
 * @property {(email: string, patch: Partial<Member>) => Promise<Member | null>} updateMember
 * @property {(email: string, password: string) => Promise<Member | null>} resetMemberPassword
 * @property {(email: string) => Promise<boolean>} deleteMember
 * @property {EventItem[]} events
 * @property {(event: EventItem) => Promise<EventItem>} createEvent
 * @property {(id: string, patch: Partial<EventItem>) => Promise<EventItem | null>} updateEvent
 * @property {(id: string) => Promise<boolean>} deleteEvent
 * @property {(id: string) => Promise<EventItem | null>} openEventSignup
 * @property {Tournament[]} tournaments
 * @property {(tournament: Tournament) => Promise<Tournament>} createTournament
 * @property {(id: string, patch: Partial<Tournament>) => Promise<Tournament | null>} updateTournament
 * @property {(id: string) => Promise<boolean>} deleteTournament
 * @property {(id: string) => Promise<Tournament | null>} registerToTournament
 * @property {(id: string) => Promise<Tournament | null>} cancelRegistration
 * @property {string[]} wordBank
 * @property {(word: string) => Promise<string[]>} addWord
 * @property {(word: string) => Promise<string[]>} removeWord
 * @property {() => Promise<string>} getTodayWord
 * @property {(guess: string, answer: string) => Promise<WordleAttempt>} submitWordleGuess
 * @property {() => Promise<string[]>} loadEnglishGuessWords
 * @property {MinecraftRequest[]} minecraftRequests
 * @property {(request: Omit<MinecraftRequest, 'status'>) => Promise<MinecraftRequest>} submitMinecraftParticipationRequest
 * @property {(name: string, status: RequestStatus) => Promise<MinecraftRequest | null>} updateMinecraftRequestStatus
 * @property {Rankings} rankings
 */

/**
 * @typedef {object} SuccessMessage
 * @property {string} title
 * @property {string} copy
 * @property {() => void=} action
 * @property {string=} actionLabel
 */

export {}

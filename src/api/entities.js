import { supabase } from '@/lib/supabase'

/**
 * Generic entity service factory
 * Creates a service with CRUD operations for a Supabase table
 */
export const createEntityService = (tableName) => ({
  // List with sorting and pagination
  async list(orderBy = 'created_at', limit = 100, ascending = false) {
    const column = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy
    const direction = orderBy.startsWith('-') ? 'desc' : 'asc'
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(column, { ascending: direction === 'asc' })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },
  
  // Filter with multiple conditions
  async filter(filters = {}) {
    let query = supabase.from(tableName).select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else {
          query = query.eq(key, value)
        }
      }
    })
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  
  // Get by ID
  async get(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // Create
  async create(record) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Create multiple
  async createMany(records) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(records)
      .select()
    
    if (error) throw error
    return data || []
  },
  
  // Update
  async update(id, updates) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Delete
  async delete(id) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
  
  // Upsert (insert or update)
  async upsert(record, conflictColumn = 'id') {
    const { data, error } = await supabase
      .from(tableName)
      .upsert(record, { onConflict: conflictColumn })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
})

// Export entity services for all tables
export const Question = createEntityService('questions')
export const Score = createEntityService('scores')
export const UserProgress = createEntityService('user_progress')
export const Challenge = createEntityService('challenges')
export const Friendship = createEntityService('friendships')
export const DailyChallenge = createEntityService('daily_challenges')
export const DailyScore = createEntityService('daily_scores')
export const Message = createEntityService('messages')
export const Notification = createEntityService('notifications')
export const UserStreak = createEntityService('user_streaks')
export const Achievement = createEntityService('achievements')
export const UserAchievement = createEntityService('user_achievements')
export const Subscription = createEntityService('subscriptions')
export const DailyPlayCount = createEntityService('daily_play_counts')
export const PowerUp = createEntityService('power_ups')
export const PlatformStats = createEntityService('platform_stats')
export const Referral = createEntityService('referrals')
export const DailyReward = createEntityService('daily_rewards')
export const UserSubmittedQuestion = createEntityService('user_submitted_questions')
export const Squad = createEntityService('squads')
export const SquadMember = createEntityService('squad_members')
export const Purchase = createEntityService('purchases')
export const Report = createEntityService('reports')
export const AllowedUser = createEntityService('allowed_users')
export const InviteCode = createEntityService('invite_codes')
export const BetaAccess = createEntityService('beta_access')
export const ConnectionPuzzle = createEntityService('connection_puzzles')

// Export User from auth (for compatibility)
export { auth as User } from './auth'

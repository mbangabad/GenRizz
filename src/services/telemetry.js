import { supabase } from '@/lib/supabase'

const SESSION_KEY = 'genrizz_session_id'
const ENABLE_REMOTE = String(import.meta.env.VITE_ENABLE_REMOTE_TELEMETRY || '').toLowerCase() === 'true'
const canUseRemote = () => ENABLE_REMOTE && Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const uuid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

const getSessionId = () => {
  let sid = localStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = uuid()
    localStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

const getUserContext = async () => {
  try {
    const { data } = await supabase.auth.getUser()
    const user = data?.user
    return { user_id: user?.id || null }
  } catch {
    return { user_id: null }
  }
}

export async function emitEvent(name, props = {}) {
  const session_id = getSessionId()
  const ctx = await getUserContext()
  if (!canUseRemote()) return
  try {
    await supabase.from('events').insert({ name, props, session_id, user_id: ctx.user_id })
  } catch (e) {
    console.warn('telemetry emit failed', e?.message)
  }
}

export async function emitError(payload) {
  const session_id = getSessionId()
  const ctx = await getUserContext()
  const { message, stack, page, meta } = payload
  if (!canUseRemote()) return
  try {
    await supabase.from('errors').insert({ message, stack, page, meta: meta || {}, session_id, user_id: ctx.user_id })
  } catch (e) {
    console.warn('telemetry error emit failed', e?.message)
  }
}

export function getSession() {
  return { session_id: getSessionId() }
}

export async function logAdminAction(action, meta = {}) {
  if (!canUseRemote()) return
  try {
    const { data } = await supabase.auth.getUser()
    const adminId = data?.user?.id || null
    await supabase.from('admin_audit_log').insert({ admin_id: adminId, action, meta })
  } catch (e) {
    console.warn('admin audit log failed', e?.message)
  }
}

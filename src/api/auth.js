import { supabase } from '@/lib/supabase'

export const auth = {
  // Get current user with profile
  async me() {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          hearts: 5,
          is_premium: false,
          role: 'user'
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating user profile:', createError)
        return { ...user, full_name: user.email?.split('@')[0] || 'User', hearts: 5, is_premium: false, role: 'user' }
      }
      
      return { ...user, ...newProfile }
    }
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return { ...user, full_name: user.email?.split('@')[0] || 'User', hearts: 5, is_premium: false, role: 'user' }
    }
    
    return { ...user, ...profile }
  },
  
  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  // Sign up with email and password
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`
      }
    })
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    
    // Create user profile (if user was created)
    if (data && data.user) {
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: metadata.full_name || email.split('@')[0] || 'User',
            hearts: 5,
            is_premium: false,
            role: 'user'
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw - user is created, profile can be created later
        }
      } catch (err) {
        console.error('Profile creation error:', err);
        // Don't throw - user is created, profile can be created later
      }
    }
    
    return data
  },
  
  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  // Update user and profile
  async updateMe(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    // Update auth metadata
    if (updates.email || updates.password) {
      const authUpdates = {}
      if (updates.email) authUpdates.email = updates.email
      if (updates.password) authUpdates.password = updates.password
      
      const { error } = await supabase.auth.updateUser(authUpdates)
      if (error) throw error
    }
    
    // Update profile
    const profileUpdates = { ...updates }
    delete profileUpdates.email
    delete profileUpdates.password
    
    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: user.id, ...profileUpdates, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      if (error) throw error
    }
  },
  
  // Redirect to login (for compatibility with Base44)
  redirectToLogin(returnUrl = null) {
    const url = `/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
    window.location.href = url;
    // Force navigation if href doesn't work
    setTimeout(() => {
      if (window.location.pathname !== '/login') {
        window.location.replace(url);
      }
    }, 100);
  },
  
  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },
  
  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}


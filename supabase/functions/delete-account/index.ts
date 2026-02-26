import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create client with user's token to get their identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Use service role client to delete all user data
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get the user's profile id
    const { data: profile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      const profileId = profile.id

      // Delete in order respecting foreign keys
      await adminClient.from('gift_transactions').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
      await adminClient.from('post_replies').delete().eq('author_id', profileId)
      await adminClient.from('posts').delete().eq('author_id', profileId)
      await adminClient.from('messages').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`)
      await adminClient.from('photos').delete().eq('profile_id', profileId)
      await adminClient.from('group_members').delete().eq('profile_id', profileId)
      await adminClient.from('profile_connections').delete().or(`requester_id.eq.${profileId},receiver_id.eq.${profileId}`)
      await adminClient.from('groups').delete().eq('creator_id', profileId)
      await adminClient.from('user_roles').delete().eq('user_id', user.id)
      await adminClient.from('profiles').delete().eq('id', profileId)

      // Delete storage files
      const { data: storageFiles } = await adminClient.storage.from('photos').list(user.id)
      if (storageFiles && storageFiles.length > 0) {
        const filePaths = storageFiles.map(f => `${user.id}/${f.name}`)
        await adminClient.storage.from('photos').remove(filePaths)
      }
    }

    // Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

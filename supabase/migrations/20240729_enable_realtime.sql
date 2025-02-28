
-- Enable Realtime for the posts table
ALTER TABLE public.posts REPLICA IDENTITY FULL; 
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Enable Realtime for the profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable Realtime for user_connections table
ALTER TABLE public.user_connections REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_connections;

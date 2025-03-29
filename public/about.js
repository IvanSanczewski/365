// SUPABASE 

// prjctName_365-visions
// pswd_ozVCtfThvxGkkwtI




// Allow access to JPG images in a public folder to anonymous users
// This policy uses native postgres functions, functions from auth and storage schema

// Policy SQL template:
/*CREATE POLICY "policy_name"
ON storage.objects FOR {operation} {USING | WITH CHECK} (
  -- restrict bucket
  bucket_id = {bucket_name}
  -- allow access to only jpg file
  AND storage."extension"(name) = 'jpg'
  -- in the public folder
  AND LOWER((storage.foldername(name))[1]) = 'public'
  -- to anonymous users
  AND auth.role() = 'anon'
);*/
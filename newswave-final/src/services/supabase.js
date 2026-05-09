import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vyfrvliwvmrrcyjndeqq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZnJ2bGl3dm1ycmN5am5kZXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTg5MzMsImV4cCI6MjA5Mzg5NDkzM30.r-pM3V8045PA91zrMzNmSBPwLXkIeLv_Z7at2NeZrmo'
)
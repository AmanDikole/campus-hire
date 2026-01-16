// src/actions/index.ts
'use server'

import { supabase } from "@/lib/supabase"

export async function getJobs() {
  console.log("Attempting to fetch jobs...") // Log 1

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("❌ Supabase Error:", error.message) // Log Error
    return []
  }

  console.log("✅ Data found:", data) // Log Success
  return data || []
}
export function checkEligibility(studentProfile: any, job: any) {
  const reasons: string[] = []

  // 1. Admin Verification Check
  if (job.requireVerification && !studentProfile.isVerified) {
    reasons.push("Profile not verified by TPO")
  }

  // 2. CGPA Check
  if (studentProfile.cgpa < job.minCgpa) {
    reasons.push(`Minimum CGPA required: ${job.minCgpa}`)
  }

  // 3. Backlog Check
  if (studentProfile.liveBacklogs > job.maxLiveBacklogs) {
    reasons.push(`Company allows max ${job.maxLiveBacklogs} live backlogs`)
  }

  return {
    isEligible: reasons.length === 0,
    reasons
  }
}

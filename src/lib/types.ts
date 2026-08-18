export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  full_name: string
  college: string
  phone: string
  role: UserRole
  created_at: string
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export type PassType = 'monthly' | 'quarterly' | 'annual'

export interface Application {
  id: string
  user_id: string
  full_name: string
  college: string
  email: string
  phone: string
  source: string
  destination: string
  pass_type: PassType
  start_date: string
  end_date: string
  status: ApplicationStatus
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface BusPass {
  id: string
  application_id: string
  user_id: string
  pass_id: string
  full_name: string
  college: string
  email: string
  source: string
  destination: string
  pass_type: PassType
  start_date: string
  end_date: string
  status: string
  created_at: string
}

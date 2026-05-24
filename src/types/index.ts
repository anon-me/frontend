// ═══════════════════════════════════════════
//  USER TYPES
// ═══════════════════════════════════════════

export interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin';
  is_premium: boolean;
  premium_expires_at: string | null;
  storage_used: number;
  storage_limit: number;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  active_subscription?: Subscription | null;
}

export interface UserStats {
  notes_count: number;
  friends_count: number;
  shared_with_me: number;
  files_count: number;
  storage_used_mb: number;
  storage_limit_mb: number;
}

// ═══════════════════════════════════════════
//  NOTE TYPES
// ═══════════════════════════════════════════

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  plain_text: string | null;
  color: string;
  is_pinned: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  shares?: NoteShare[];
  files?: FileItem[];
  pivot?: { permission: string; shared_by: number };
}

export interface NoteShare {
  id: number;
  note_id: number;
  shared_by: number;
  shared_with: number;
  permission: 'view' | 'edit';
  created_at: string;
  recipient?: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatar'>;
  sharer?: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatar'>;
}

export interface NoteVersion {
  id: number;
  note_id: number;
  user_id: number;
  content: string;
  plain_text: string | null;
  version_number: number;
  created_at: string;
  user?: Pick<User, 'id' | 'name'>;
}

// ═══════════════════════════════════════════
//  FRIENDSHIP TYPES
// ═══════════════════════════════════════════

export interface Friendship {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: string;
  sender?: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatar'>;
  receiver?: Pick<User, 'id' | 'name' | 'username' | 'email' | 'avatar'>;
}

export interface Friend {
  id: number;
  name: string;
  username?: string;
  email: string;
  avatar: string | null;
  is_active?: boolean;
}

// ═══════════════════════════════════════════
//  FILE TYPES
// ═══════════════════════════════════════════

export interface FileItem {
  id: number;
  user_id: number;
  note_id: number | null;
  original_name: string;
  stored_name: string;
  path: string;
  mime_type: string;
  size: number;
  r2_key: string;
  r2_url: string | null;
  created_at: string;
}

// ═══════════════════════════════════════════
//  SUBSCRIPTION & PAYMENT TYPES
// ═══════════════════════════════════════════

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  duration_days: number;
  storage_limit: number;
  file_sharing_enabled: boolean;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  payment_id: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  plan?: SubscriptionPlan;
}

export interface Payment {
  id: number;
  user_id: number;
  plan_id: number;
  identifier: string;
  trx_number: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  payment_method: string | null;
  created_at: string;
  plan?: Pick<SubscriptionPlan, 'id' | 'name'>;
}

// ═══════════════════════════════════════════
//  ADMIN TYPES
// ═══════════════════════════════════════════

export interface DashboardStats {
  total_users: number;
  active_users: number;
  premium_users: number;
  total_notes: number;
  total_shared_notes: number;
  total_friendships: number;
  total_files: number;
  total_storage_used: string;
  total_revenue: number;
  active_subscriptions: number;
  recent_signups: number;
  recent_payments: number;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  group: string;
}

// ═══════════════════════════════════════════
//  API RESPONSE TYPES
// ═══════════════════════════════════════════

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string | string[];
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

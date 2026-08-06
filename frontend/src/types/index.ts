export type ScreenId =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'reg_success'
  | 'home'
  | 'booking'
  | 'booking_success'
  | 'points'
  | 'profile'
  | 'vehicles'
  | 'history'
  | 'promotions'
  | 'car_status'
  | 'notifications'
  | 'settings'
  | 'admin';

export type MemberLevel = 'Silver Member' | 'Gold VIP' | 'Platinum Elite' | 'Black Diamond';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  year: string;
  isPrimary: boolean;
  userId?: string;
}

export interface SpaService {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  durationMinutes: number;
  priceTHB: number;
  category: 'Wash & Care' | 'Coating & Paint' | 'Interior Spa' | 'Full Executive' | string;
  pointsEarned: number;
  popular?: boolean;
  badge?: string;
  badge_en?: string;
  steps?: string[];
  steps_en?: string[];
  addons?: { name: string; priceTHB: number; note?: string }[];
  note?: string;
}

export interface SpaBranch {
  id: string;
  name: string;
  name_en?: string;
  address: string;
  phone: string;
  distance: string;
  openHours: string;
  openHours_en?: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  service: SpaService;
  vehicle: Vehicle;
  branch: SpaBranch;
  date: string;
  time: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Pending Deposit Approval' | string;
  qrCode?: string;
  totalAmount: number;
  pointsEarned: number;
  user?: UserProfile;
}

export interface CarProgressStage {
  step: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'upcoming';
  time: string;
  notes?: string;
}

export interface CarLiveStatus {
  bookingId: string;
  vehicle: Vehicle;
  serviceName: string;
  branchName: string;
  currentStep: number;
  estimatedFinishTime: string;
  bayNumber: string;
  technicianName: string;
  stages: CarProgressStage[];
  photoProgressUrl?: string;
}

export interface PointTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'earn' | 'redeem';
  category: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  ptsRequired: number;
  category: string;
  isAvailable: boolean;
  code?: string;
}

export interface PromotionCoupon {
  id: string;
  title: string;
  description: string;
  code: string;
  discountBadge: string;
  validUntil: string;
  minSpendTHB: number;
  isClaimed: boolean;
  bannerGradient: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'status' | 'booking' | 'promo' | 'system';
}

export interface UserProfile {
  id: string;
  lineUserId?: string;
  lineDisplayName: string;
  linePictureUrl: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  province: string;
  memberId: string;
  memberLevel: MemberLevel;
  points: number;
  usageCount: number;
  pdpaAccepted: boolean;
  vehicles: Vehicle[];
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  inProgressBookings: number;
  confirmedBookings: number;
  serviceBreakdown: {
    id: string;
    name: string;
    count: number;
    revenue: number;
  }[];
}

import {
  UserProfile,
  SpaService,
  SpaBranch,
  BookingRecord,
  CarLiveStatus,
  PointTransaction,
  RewardItem,
  PromotionCoupon,
  NotificationItem,
  Vehicle,
  AdminAnalytics,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (lineUserId?: string) => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  ...(lineUserId ? { 'x-line-user-id': lineUserId } : {}),
});

// Helper for fetch with 15-second timeout protection (accommodating Render cold starts)
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error('Server returned HTML instead of JSON');
  }
  try {
    return await res.json();
  } catch (err) {
    throw new Error('Invalid JSON response');
  }
}

export interface SlotAvailability {
  date: string;
  slots: Array<{
    time: string;
    occupiedCount: number;
    maxCapacity: number;
    availableBays: number;
    isFull: boolean;
    status: 'FULL' | 'PARTIAL' | 'EMPTY';
  }>;
}

export const apiService = {
  // User Profile & LINE LIFF Sync
  async getUserProfile(lineUserId?: string): Promise<UserProfile> {
    const res = await fetchWithTimeout(`${API_BASE}/user`, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async syncLiffUser(lineProfile: {
    lineUserId: string;
    lineDisplayName: string;
    linePictureUrl?: string;
    email?: string;
  }): Promise<UserProfile> {
    const res = await fetchWithTimeout(`${API_BASE}/user/sync-liff`, {
      method: 'POST',
      headers: getHeaders(lineProfile.lineUserId),
      body: JSON.stringify(lineProfile),
    });
    if (!res.ok) throw new Error('Failed to sync LIFF user');
    return res.json();
  },

  async updateUserProfile(data: Partial<UserProfile> & { userId: string }, lineUserId?: string): Promise<UserProfile> {
    const res = await fetchWithTimeout(`${API_BASE}/user/update`, {
      method: 'PUT',
      headers: getHeaders(lineUserId),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Services & Branches
  async getServices(): Promise<SpaService[]> {
    const res = await fetchWithTimeout(`${API_BASE}/services`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getBranches(): Promise<SpaBranch[]> {
    const res = await fetchWithTimeout(`${API_BASE}/branches`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch branches');
    return res.json();
  },

  // Bookings & FIFO 3-Bay Slot Availability
  async getSlotAvailability(date: string): Promise<SlotAvailability> {
    const res = await fetchWithTimeout(`${API_BASE}/bookings/availability?date=${date}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch slot availability');
    return res.json();
  },

  async getBookings(lineUserId?: string): Promise<BookingRecord[]> {
    const url = lineUserId ? `${API_BASE}/bookings?lineUserId=${lineUserId}` : `${API_BASE}/bookings`;
    const res = await fetchWithTimeout(url, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async createBooking(
    bookingData: {
      userId: string;
      serviceId: string;
      vehicleId: string;
      branchId: string;
      date: string;
      time: string;
      vehicle?: Vehicle;
    },
    lineUserId?: string
  ): Promise<BookingRecord & { fifoInfo?: any }> {
    const res = await fetchWithTimeout(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(lineUserId),
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      let errMsg = 'Failed to create booking';
      try {
        const errJson = await parseJsonResponse<any>(res);
        if (errJson.error || errJson.message) errMsg = errJson.error || errJson.message;
      } catch {}
      throw new Error(errMsg);
    }
    return parseJsonResponse(res);
  },

  // Vehicles
  async getVehicles(lineUserId?: string): Promise<Vehicle[]> {
    const res = await fetchWithTimeout(`${API_BASE}/vehicles`, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },

  async addVehicle(vehicleData: Omit<Vehicle, 'id'> & { userId: string }, lineUserId?: string): Promise<Vehicle> {
    const res = await fetchWithTimeout(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: getHeaders(lineUserId),
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) throw new Error('Failed to add vehicle');
    return res.json();
  },

  async deleteVehicle(vehicleId: string, lineUserId?: string): Promise<void> {
    const res = await fetchWithTimeout(`${API_BASE}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: getHeaders(lineUserId),
    });
    if (!res.ok) throw new Error('Failed to delete vehicle');
  },

  // Car Live Status strictly isolated by customer lineUserId
  async getCarLiveStatus(lineUserId?: string): Promise<CarLiveStatus> {
    const res = await fetchWithTimeout(`${API_BASE}/car-status`, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch live car status');
    return res.json();
  },

  // Points & Rewards
  async getRewards(): Promise<RewardItem[]> {
    const res = await fetchWithTimeout(`${API_BASE}/points/rewards`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch rewards');
    return res.json();
  },

  async getPointHistory(lineUserId?: string): Promise<PointTransaction[]> {
    const res = await fetchWithTimeout(`${API_BASE}/points/history`, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch point history');
    return res.json();
  },

  async redeemReward(userId: string, rewardId: string, lineUserId?: string): Promise<{ success: boolean; user: UserProfile; rewardCode?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/points/redeem`, {
      method: 'POST',
      headers: getHeaders(lineUserId),
      body: JSON.stringify({ userId, rewardId }),
    });
    if (!res.ok) throw new Error('Failed to redeem reward');
    return res.json();
  },

  // Promotions & Notifications
  async getPromotions(): Promise<PromotionCoupon[]> {
    const res = await fetchWithTimeout(`${API_BASE}/promotions`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch promotions');
    return res.json();
  },

  async getNotifications(lineUserId?: string): Promise<NotificationItem[]> {
    const res = await fetchWithTimeout(`${API_BASE}/notifications`, { headers: getHeaders(lineUserId) });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  // Shop Owner / Admin Endpoints with Security Guard Header
  async getAdminAnalytics(lineUserId?: string): Promise<AdminAnalytics> {
    const res = await fetchWithTimeout(`${API_BASE}/admin/analytics`, { headers: getHeaders(lineUserId) });
    if (!res.ok) {
      if (res.status === 403) throw new Error('403 Forbidden: IAM Security Authorization Failed');
      throw new Error('Failed to fetch admin analytics');
    }
    return res.json();
  },

  async updateCarLiveStatus(
    data: {
      bookingId: string;
      currentStep: number;
      bayNumber?: string;
      technicianName?: string;
      estimatedFinishTime?: string;
    },
    lineUserId?: string
  ): Promise<CarLiveStatus> {
    const res = await fetchWithTimeout(`${API_BASE}/admin/car-status`, {
      method: 'PUT',
      headers: getHeaders(lineUserId),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      if (res.status === 403) throw new Error('403 Forbidden: IAM Security Authorization Failed');
      throw new Error('Failed to update car status');
    }
    return res.json();
  },

  async updateBookingStatus(bookingId: string, status: string, lineUserId?: string): Promise<BookingRecord> {
    const res = await fetchWithTimeout(`${API_BASE}/admin/booking-status`, {
      method: 'PUT',
      headers: getHeaders(lineUserId),
      body: JSON.stringify({ bookingId, status }),
    });
    if (!res.ok) {
      if (res.status === 403) throw new Error('403 Forbidden: IAM Security Authorization Failed');
      throw new Error('Failed to update booking status');
    }
    return res.json();
  },
};

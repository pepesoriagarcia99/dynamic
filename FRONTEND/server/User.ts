export interface IUserAvatar {
  picture: string;
  alt?: string;
  name: string;
}

export interface IUserImage {
  src: string;
  alt: string;
}

export interface IUserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IUserSocialMedia {
  platform: string;
  url: string;
  username: string;
}

export interface IUserEmployment {
  company: string;
  position: string;
  department: string;
  startDate: string;
}

export interface IUserPreferences {
  language: string;
  timezone: string;
  darkMode: boolean;
  notifications: boolean;
}

export interface IUserSubscription {
  plan: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface IUserEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IUser {
  id: string;
  avatar: IUserAvatar;
  image: IUserImage;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  address: IUserAddress;
  socialMedia: IUserSocialMedia[];
  employment: IUserEmployment;
  bio: string;
  website: string;
  role: 'admin' | 'editor' | 'viewer' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  preferences: IUserPreferences;
  subscription: IUserSubscription;
  tags: string[];
  skills: string[];
  rating: number;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  emergencyContact: IUserEmergencyContact;
  referralCode: string;
}
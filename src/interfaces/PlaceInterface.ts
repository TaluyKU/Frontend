export interface Place {
  _id: string;
  name: string;
  alternativeNames?: string[];
  location: { latitude: number; longitude: number };
  generalInfo?: string;
  images?: string[];
  weeklySchedule?: {
    date: string;
    time: {
      start: {
        hour: string;
        minute: string;
      };
      end: {
        hour: string;
        minute: string;
      };
    };
  }[];
  categories: string[];
  phone?: string[];
  website?: string[];
  email?: string[];
  reviewsCountLastMonth: number;
  averageRating: number;
  createdAt: Date;
}

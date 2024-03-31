export interface Review {
  userId: string;
  placeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userInfo?: {
    _id: string;
    name: string;
    avatar: string;
  };
}

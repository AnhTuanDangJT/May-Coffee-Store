export type FeedbackItem = {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    name: string;
    email?: string;
  };
  createdAt: string;
};

export type RatingSummary = {
  averageRating: number;
  countApproved: number;
};


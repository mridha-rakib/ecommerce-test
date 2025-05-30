export interface Product {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  images: {
    public_id: string;
    secure_url: string;
    optimizeUrl: string;
  }[];
  video?: {
    public_id: string;
    secure_url: string;
  };
  status: boolean;
  price: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductApiResponse {
  status: number;
  succcess: boolean;
  message: string;
  data: Product[];
}

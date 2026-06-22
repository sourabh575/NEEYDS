import API from "./axios";

export const toggleWishlist = (postId) =>{
    return API.post(`/wishlist/toggle/${postId}`);
}

export const getWishlist = () =>
  API.get("/wishlist");

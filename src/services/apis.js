// const BASE_URL = "https://nityambackend.onrender.com/api/v1";
const BASE_URL = 'http://localhost:8080/api/v1';
// const BASE_URL = "https://nityambackend-production.up.railway.app/api/v1";


export const endpoints = {
  SENDOTP_API: `${BASE_URL}/auth/sendotp`,
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  RESETPASSTOKEN_API: `${BASE_URL}/auth/reset-password-token`,
  RESETPASSWORD_API: `${BASE_URL}/auth/reset-password`,
  GOOGLE_DETAILS: `${BASE_URL}/auth/googledetails`,
  SEARCH_USER: `${BASE_URL}/auth/search`,
  PROFILE_DETAILS: `${BASE_URL}/auth/profiledetails`,
  COMMUNITY_ADDRESS: `${BASE_URL}/auth/communityaddress`,
  COMMUNITY: `${BASE_URL}/auth/community`,
  VERIFICATION: `${BASE_URL}/auth/verification`,
  PROFESSION: `${BASE_URL}/auth/profession`,
};

export const postEndpoints = {
  CREATE_POST: `${BASE_URL}/post/createpost`,
  DELETE_POST: `${BASE_URL}/post/deletepost`,
  UPDATE_POST: `${BASE_URL}/post/updatepost`,
  GET_ALL_POST: `http://localhost:8080/api/v1/post/getcommunitypost`,
  GET_COMMUNITY_EVENTS: `${BASE_URL}/post/events`,
  GET_EVENT_BY_ID: `${BASE_URL}/post/event`, // append /:id later in API

  // Poll voting & voters
  VOTE_ON_POLL: `${BASE_URL}/post`, // + /:postId/vote
  GET_POLL_VOTERS: `${BASE_URL}/post`, // + /:postId/voters/:index

  // Post engagement
  SET_LIKE_UNLIKE: `${BASE_URL}/like/setlike-unlike`, // (if exists, otherwise remove)
  COMMENT: `${BASE_URL}/comment/comment`,
  UNCOMMENT: `${BASE_URL}/comment/deletecomment`,
  REPLY: `${BASE_URL}/comment/reply`,
  LIKE_COMMENT: `${BASE_URL}/comment/like-comment`,
  LIKE_REPLY: `${BASE_URL}/comment/like-reply`,
};

export const chatEndpoints = {
  ACCESS_CHAT: `${BASE_URL}/chat`,
  FETCH_CHAT: `${BASE_URL}/chat`,
  GROUP_CHAT: `${BASE_URL}/chat/groupchat`,
  RENAME: `${BASE_URL}/chat/rename`,
  ADD_TO_GROUP: `${BASE_URL}/chat/addtogroup`,
  REMOVE_FROM_GROUP: `${BASE_URL}/chat/removefromgroup`,
  CREATE_MESSAGE: `${BASE_URL}/message`,
  ALL_MESSAGE: `${BASE_URL}/message/:chatId`,
};

export const profileEndpoints = {
  DELETE_ACCOUNT: `${BASE_URL}/profile/deleteProfile`,
  UPDATE_PROFILE: `${BASE_URL}/profile/updateProfile`,
  UPDATE_PROFILE_PIC: `${BASE_URL}/profile/updateDisplayPicture`,
  CHANGE_PASSWORD: `${BASE_URL}/profile/changepassword`,
  GET_USER_DETAIL: `${BASE_URL}/profile/getuserdetail`
};
export const serviceEndpoints = {
  CREATE_SERVICE: `${BASE_URL}/services/createservice`,
  GET_SERVICES: `${BASE_URL}/services/getservices`,
  GET_SERVICE_BY_ID: `${BASE_URL}/services/service/:id`,
};

export const locationEndpoints = {
  ACCESS_TOKEN: `${BASE_URL}/token/getaccesstoken`,
  GET_AREAS: `${BASE_URL}/token/getareas`,
};
export const pageEndpoints = {
  CREATE_PAGE: `${BASE_URL}/page/createpage`,
  VIEW_PAGE: `${BASE_URL}/page/page`,
  GET_PAGES: `${BASE_URL}/page/allpages`,
  UPDATE_PAGE: `${BASE_URL}/page/updatepage`,
  DELETE_PAGE: `${BASE_URL}/page/deletepage`,
};
export const eventEndpoints = {
  CREATE_PAGE: `${BASE_URL}/page/createpage`,
  VIEW_PAGE: `${BASE_URL}/page/page`,
  GET_PAGES: `${BASE_URL}/post/events`,
  VIEW_PAGE: `${BASE_URL}/post/event/:id`,
};
export const adEndpoints = {
  GET_COMMUNITIES: `${BASE_URL}/advpost/getcommunities`,
  CREATE_AD: `${BASE_URL}/advpost/createadvpost`,
  GET_AD: `${BASE_URL}/advpost/advpost`,
  VERFITY_AD: `${BASE_URL}/advpost/verify-payment`,
};

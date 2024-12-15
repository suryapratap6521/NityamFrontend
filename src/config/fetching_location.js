import axios from "axios";
import { locationEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";

/**
 * Fetches a new access token.
 * @returns {Promise<string>} The fetched access token.
 */
export const fetchAccessToken = async () => {
  try {
    const response = await axios.post(locationEndpoints.ACCESS_TOKEN);
    const accessToken = response.data.access_token;
    console.log(accessToken, "----> Access Token");
    return accessToken;
  } catch (error) {
    console.error("Error fetching the token:", error);
    toast.error("Failed to fetch access token.");
    throw error;
  }
};

/**
 * Fetches suggestions for a given query and access token.
 * @param {string} query - The query string for suggestions.
 * @param {string} accessToken - The access token for API authorization.
 * @returns {Promise<Array>} Array of suggestion results.
 */
export const fetchAreaSuggestions = async (query, accessToken) => {
  if (!query) return [];
  try {
    const response = await axios.post(locationEndpoints.GET_AREAS, {
      address: query,
      access_token: accessToken,
    });
    return response.data.copResults || [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    toast.error("Failed to fetch area suggestions.");
    throw error;
  }
};

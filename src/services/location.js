import fetchApi from "./client";

export const locationService = {
  // 1. Get Public Locations (Active States with active Cities)
  async getPublicLocations() {
    try {
      const res = await fetchApi("/locations", { method: "GET" });
      if (res && res.success && res.data) {
        return { ...res, locations: Array.isArray(res.data) ? res.data : [] };
      }
      return { ...res, locations: Array.isArray(res) ? res : [] };
    } catch (e) {
      console.warn("getPublicLocations error:", e);
      return { success: false, locations: [] };
    }
  },

  // 2. Admin: Get All Locations with search filter
  async getAllLocationsAdmin(params = {}, token = null) {
    const res = await fetchApi("/locations/admin", { method: "GET", params, token });
    if (res.success && res.data) {
      return { ...res, locations: Array.isArray(res.data) ? res.data : [] };
    }
    return { ...res, locations: [] };
  },

  // 3. Admin: Create State Location
  async createState(data, token = null) {
    return await fetchApi("/locations", { method: "POST", body: data, token });
  },

  // 4. Admin: Update State Location
  async updateState(id, data, token = null) {
    return await fetchApi(`/locations/${encodeURIComponent(id)}`, { method: "PUT", body: data, token });
  },

  // 5. Admin: Delete State Location
  async deleteState(id, token = null) {
    return await fetchApi(`/locations/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },

  // 6. Admin: Add City/District to State
  async addCityToState(stateId, data, token = null) {
    return await fetchApi(`/locations/${encodeURIComponent(stateId)}/cities`, { method: "POST", body: data, token });
  },

  // 7. Admin: Delete City/District from State
  async deleteCityFromState(stateId, cityId, token = null) {
    return await fetchApi(`/locations/${encodeURIComponent(stateId)}/cities/${encodeURIComponent(cityId)}`, { method: "DELETE", token });
  },

  // 8. Admin: Seed Default Locations
  async seedDefaultLocations(token = null) {
    return await fetchApi("/locations/seed", { method: "POST", token });
  }
};

export default locationService;

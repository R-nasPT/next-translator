import axios from "axios";

//สามารถ ใส่ token ได้หลายวิธี

export const axiosInstance = axios.create({
  baseURL: process.env.IFP_HOST,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${process.env.IFP_TOKEN}`,
    // Authorization: `Bearer 1pzYTQUJynEjFOesdRULww0ViD8KX7-Pm5K9InXrL7I5xEtfsqkHru8xrSXM7jClXdiPW33ILfY9bLvNEGOD1lorOEZhjmLevTYijvhg5R-oYqafMrBI1NMHGTVgK7EbmA7l6V`,
  },
});

export function createAxiosInstance(token?: string) {

  // if (token) {
  //   instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // }

  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log(11111111111111111111);
      console.log(token);

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        //config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        console.error("Network error or server not responding");
      } else {
        console.error(
          `API error: ${error.response.status} - ${error.response.statusText}`
        );
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export const strapiUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_HOST, //<-- ต้องถูกประกาศด้วยคำนำหน้าว่า NEXT_PUBLIC_ หากต้องการให้สามารถเข้าถึงได้จากฝั่งไคลเอนต์
  headers: {
    "Content-Type": "application/json",
  },
});

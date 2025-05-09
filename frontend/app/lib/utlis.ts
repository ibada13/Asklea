import axios from "./axios";
import * as Gaxios from "axios";

export async function get(route: string) {
  try {
    const response = await axios.get(route);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return null;
  }
}




export async function getAdmin(route: string) {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get(route, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      return response.data;
    } catch (error: any) {
      if (Gaxios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.warn("Unauthorized - user needs to log in");
            return null;
        } else {
          console.error("API error:", error.response?.status, error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  }


export async function post(route: string, data: any) {
  
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        console.log(data)
        const response = await axios.post(route, data, {
            headers: {
            Authorization: token ? `Bearer ${token}` : '',
              "Content-Type": "application/json"
            
            },
        })

        console.log(response.data)
        return response.data
    } catch (e) {
        console.error(e)
    }
}
export async function postForm(route: string, data: any) {
  
  try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      console.log(data)
      const response = await axios.post(route, data, {
          headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
          },
      })

      console.log(response.data)
      return response.data
  } catch (e) {
      console.error(e)
  }
}

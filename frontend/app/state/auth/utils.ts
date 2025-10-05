import axios from "@/app/lib/axios";



const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);




export async function login(email: string, password: string) { 
     try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const res = await axios.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.access_token);
      }

      return res.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || err?.message || 'Login failed';
      return message
    }
  }


export async function register(username:string , email :string  , password:string ) { 
    const token = getToken();

    const res = await axios.post(
      '/auth/register',
      { username, email, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  
}



export const getUser = async () => {
  const token = getToken();
  if (!token) return null;

  const res = await axios.get('/auth/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

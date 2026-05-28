import api from './api';

export const getDbUserId = async (user) => {
  if (!user || !user.email) return null;
  
  try {
    const res = await api.get(`/users/email/${user.email}`);
    return res.data.id;
  } catch (err) {
    if (err.response && (err.response.status === 404 || err.response.status === 500)) {
        // User not found in backend DB, let's create it
        try {
            const newUserRes = await api.post('/users', {
                email: user.email,
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                password: "default_oauth_password",
                role: "customer"
            });
            return newUserRes.data.id;
        } catch (createErr) {
            console.error("Error syncing user to backend:", createErr);
            return null;
        }
    }
    console.error("Error fetching user from backend:", err);
    return null;
  }
};

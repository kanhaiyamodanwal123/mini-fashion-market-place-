import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Configure axios with token
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          // Token expired, try to refresh
          try {
            const refreshResponse = await api.post('/auth/refresh');
            const newToken = refreshResponse.data.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            setAccessToken(newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            const userResponse = await api.get('/auth/me');
            setUser(userResponse.data.data);
          } catch (refreshError) {
            // Refresh failed, clear everything
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            delete api.defaults.headers.common['Authorization'];
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user: userData } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    setAccessToken(accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(userData);
    
    return response.data;
  };

  const signup = async (name, email, password, role) => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API fails
    }
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    const response = await api.put('/auth/profile', { name, email });
    setUser(response.data.data);
    return response.data;
  };

  const updateAvatar = async (avatar) => {
    const response = await api.put('/auth/avatar', { avatar });
    setUser(response.data.data);
    return response.data;
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/auth/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setUser(response.data.data);
    return response.data;
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updatePaymentSettings = async (paymentDetails) => {
    const response = await api.put('/auth/payment-settings', paymentDetails);
    setUser({ ...user, paymentDetails: response.data.data.paymentDetails });
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updateAvatar,
    uploadAvatar,
    refreshUser,
    updatePaymentSettings,
    isAuthenticated: !!user,
    isBrand: user?.role === 'brand',
    isCustomer: user?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


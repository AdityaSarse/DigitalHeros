import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authApi } from '../api/auth';
import { adminApi } from '../api/admin';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile and verify admin role
  const fetchProfile = async () => {
    try {
      const res = await authApi.getMe();
      let userProfile = res.data?.data || null;

      // Check if user is an admin by probing an admin endpoint
      let isUserAdmin = false;
      try {
        const adminCheck = await adminApi.getUsers();
        if (adminCheck.data?.success) {
          isUserAdmin = true;
        }
      } catch (err) {
        isUserAdmin = false;
      }

      if (userProfile) {
        userProfile.role = isUserAdmin ? 'ADMIN' : 'USER';
      }

      setProfile(userProfile);
      setIsAdmin(isUserAdmin);
      return userProfile;
    } catch (err) {
      console.warn('Could not fetch user profile:', err.customMessage || err.message);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            await fetchProfile();
          } catch (parseErr) {
            console.warn('Failed to parse stored user:', parseErr);
          }
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && session?.access_token) {
            localStorage.setItem('token', session.access_token);
            setUser(session.user);
            await fetchProfile();
          } else {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
        if (session.user) {
          localStorage.setItem('user', JSON.stringify(session.user));
          setUser(session.user);
          await fetchProfile();
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const authData = response.data?.data;

      if (authData?.access_token) {
        localStorage.setItem('token', authData.access_token);
      }

      if (authData?.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
        setUser(authData.user);
      }

      if (authData?.access_token && authData?.refresh_token) {
        try {
          await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
          });
        } catch (supabaseErr) {
          console.warn('Supabase setSession notice:', supabaseErr);
        }
      }

      await fetchProfile();
      return { success: true, data: authData };
    } catch (err) {
      return {
        success: false,
        message: err.customMessage || err.message || 'Invalid email or password.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, first_name, last_name }) => {
    setLoading(true);
    try {
      await authApi.register({ email, password, first_name, last_name });
      // After registration, auto-login
      const loginRes = await login(email, password);
      return loginRes.success
        ? { success: true }
        : { success: true, message: 'Account created. Please log in.' };
    } catch (err) {
      return {
        success: false,
        message: err.customMessage || err.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      await supabase.auth.signOut().catch(() => {});
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

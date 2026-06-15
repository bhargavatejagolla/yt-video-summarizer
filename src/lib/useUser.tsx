'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext<string>('');

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    let stored = localStorage.getItem('study_user_id');
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem('study_user_id', stored);
    }
    setUserId(stored);
  }, []);

  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);

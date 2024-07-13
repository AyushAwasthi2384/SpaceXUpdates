"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../lib/features/auth/authSlice';

const ProtectedLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.userData === null && !auth.isLoading) {
      dispatch(fetchUser());
    }
  }, []);

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.status) {
        router.replace("/");
      } else {
        router.replace("/home");
      }
    }
  }, [auth.status, auth]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  return children;
};

export default ProtectedLayout;


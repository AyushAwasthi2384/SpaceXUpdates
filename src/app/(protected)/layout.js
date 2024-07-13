"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const ProtectedLayout = ({ children }) => {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/getcurrentuser');
        if (!response.ok) {
          throw new Error('Unauthorized or user not found');
        }
        const data = await response.json();
        if (data.success) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.error(err);
        setAuth(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!auth) {
        router.replace("/");
      } else if (auth) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, auth, router]);

  if (isLoading) {
    return <div>isLoading</div>;
  }
  if (!auth) {
    return null;
  }
  return children;
};

export default ProtectedLayout;


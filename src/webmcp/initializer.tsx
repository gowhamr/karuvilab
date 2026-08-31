"use client";
import { useEffect } from 'react';
import { initializeWebMCP } from './index';

export function WebMCPInitializer() {
  useEffect(() => {
    initializeWebMCP();
  }, []);
  
  return null;
}

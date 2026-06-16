"use client";
import { useNotificationStore } from "@/store/notificationStore";

export function useNotifications() {
  const store = useNotificationStore();
  return store;
}

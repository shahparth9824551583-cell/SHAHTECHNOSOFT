"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseConfigured, getClientDb } from "./firebase-client";

/** IDs of courses/internships the admin has hidden. If Firebase is not configured, nothing is hidden. */
export function useHidden() {
  const [hidden, setHidden] = useState<string[]>([]);
  useEffect(() => {
    if (!firebaseConfigured) return;
    getDoc(doc(getClientDb(), "settings", "visibility"))
      .then((s) => setHidden((s.data()?.hidden as string[] | undefined) ?? []))
      .catch(() => {});
  }, []);
  return hidden;
}

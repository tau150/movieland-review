import { useEffect, useCallback } from "react";

export const useClickOutside = (ref, callback) => {

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current == null || ref.current.contains(event.target)) return;
      callback();
    },
    [callback, ref],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);
};
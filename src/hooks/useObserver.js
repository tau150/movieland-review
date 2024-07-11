import { useEffect } from "react"


export function useObserver(ref, callback, isLoading) {
  useEffect(() => {

    if (isLoading) {
      return
    };

    const currentRef = ref.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, ref, isLoading]);
}
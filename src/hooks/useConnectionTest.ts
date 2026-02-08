import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Tests the Supabase connection on app load.
 * Shows an error toast if the database is unreachable.
 * Only runs once per app lifecycle.
 */
export function useConnectionTest() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const { error } = await supabase
          .from("foods")
          .select("id")
          .limit(1);

        if (error) {
          console.error("[ConnectionTest] Database handshake failed:", error);
          toast.error("Database connection issue. Some features may be unavailable.", {
            duration: 8000,
          });
        } else {
          console.log("[ConnectionTest] ✅ Database connection verified");
        }
      } catch (err) {
        console.error("[ConnectionTest] Network error:", err);
        toast.error("Unable to reach the server. Please check your connection.", {
          duration: 8000,
        });
      }
    })();
  }, []);
}

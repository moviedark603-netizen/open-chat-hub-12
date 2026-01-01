import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePageViews = (pageName: string = 'home') => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    const incrementView = async () => {
      const { data, error } = await supabase.rpc('increment_page_view', {
        p_page_name: pageName
      });

      if (!error && data) {
        setViewCount(data);
      } else {
        // Fallback: fetch current count
        const { data: pageData } = await supabase
          .from('page_views')
          .select('view_count')
          .eq('page_name', pageName)
          .single();
        
        if (pageData) {
          setViewCount(pageData.view_count);
        }
      }
    };

    incrementView();
  }, [pageName]);

  return { viewCount };
};

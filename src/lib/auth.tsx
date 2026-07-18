import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isFounder: boolean;
  isLifetimeFree: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  checkLifetimeFree: (businessId?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Founder email - Co-founder Kaushik Savaliya
const FOUNDER_EMAIL = "intellectflowteam@gmail.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [isLifetimeFree, setIsLifetimeFree] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLifetimeFree = async (businessId?: string): Promise<boolean> => {
    try {
      if (!session?.user) return false;
      
      // If founder, always lifetime free - Value ₹55k+ FREE
      if (session.user.email === FOUNDER_EMAIL) {
        setIsLifetimeFree(true);
        return true;
      }

      // Check if any business of this user is lifetime free
      let query = supabase.from("businesses").select("is_lifetime_free").eq("user_id", session.user.id);
      if (businessId) {
        query = query.eq("id", businessId);
      }
      
      const { data, error } = await query;
      if (error) {
        // Column may not exist yet
        console.warn("is_lifetime_free column may not exist, run SQL:", error.message);
        return false;
      }
      
      const hasLifetime = (data as any)?.some((b: any) => b.is_lifetime_free === true);
      if (hasLifetime) setIsLifetimeFree(true);
      return hasLifetime || false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Check founder - Kaushik Savaliya - Intellectflow.in
        if (newSession.user.email === FOUNDER_EMAIL) {
          setIsFounder(true);
          setIsAdmin(true);
          setIsLifetimeFree(true);
        }
        
        // defer supabase calls to avoid deadlock
        setTimeout(async () => {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", newSession.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!data || newSession.user.email === FOUNDER_EMAIL);
          
          // Check lifetime free for this user
          await checkLifetimeFree();
        }, 0);
      } else {
        setIsAdmin(false);
        setIsFounder(false);
        setIsLifetimeFree(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.email === FOUNDER_EMAIL) {
        setIsFounder(true);
        setIsAdmin(true);
        setIsLifetimeFree(true);
      }
      setLoading(false);
      if (data.session?.user) {
        setTimeout(() => checkLifetimeFree(), 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsFounder(false);
    setIsLifetimeFree(false);
  };

  return (
    <AuthContext.Provider
      value={{ 
        session, 
        user: session?.user ?? null, 
        isAdmin, 
        isFounder,
        isLifetimeFree,
        loading, 
        signOut,
        checkLifetimeFree
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Helper: Check if user has active plan OR lifetime free - Value ₹55k+ logic
export function useHasAccess(planRequired?: "starter" | "growth" | "business") {
  const { isAdmin, isFounder, isLifetimeFree } = useAuth();
  
  // Founder and Lifetime Free get all access - Value ₹55k+ FREE
  if (isFounder || isLifetimeFree || isAdmin) return true;
  
  // Otherwise check subscription in useBusiness
  return false; // Will be checked in useBusiness
}
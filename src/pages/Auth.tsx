import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";
import HomeLogo from "@/components/HomeLogo";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  mobile: z.string().trim().min(10, "Mobile number must be at least 10 digits").max(20),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["man", "woman"], { required_error: "Please select your gender" }),
  location: z.string().trim().min(1, "Location is required").max(200),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const NETWORK_ERROR_MESSAGE = "Network issue: your browser cannot reach the authentication server from this preview. Please hard refresh, disable VPN/ad-block extensions, or try the published app URL.";

const isFetchNetworkError = (error: unknown) => {
  if (!(error instanceof Error)) return false;

  const normalizedMessage = error.message?.toLowerCase?.() ?? "";
  return (
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("networkerror") ||
    normalizedMessage.includes("load failed")
  );
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ProxyAuthAction = "signup" | "signin";

type ProxyAuthPayload = {
  action: ProxyAuthAction;
  email: string;
  password: string;
  redirectTo?: string;
  data?: {
    name: string;
    mobile_number: string;
    gender: "man" | "woman";
    location: string;
  };
};

type ProxyAuthResponse = {
  error?: { message?: string } | string;
  access_token?: string;
  refresh_token?: string;
  session?: {
    access_token?: string;
    refresh_token?: string;
  } | null;
};

const runAuthViaProxy = async (payload: ProxyAuthPayload): Promise<ProxyAuthResponse> => {
  const { data, error } = await supabase.functions.invoke("auth-proxy", {
    body: payload,
  });

  if (error) {
    throw new Error(error.message || "Authentication service is temporarily unavailable.");
  }

  const response = (data ?? {}) as ProxyAuthResponse;

  if (response.error) {
    const message =
      typeof response.error === "string"
        ? response.error
        : response.error.message || "Authentication request failed";
    throw new Error(message);
  }

  return response;
};

const runAuthWithRetry = async (
  operation: () => Promise<{ error: Error | null }>,
) => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await operation();

    if (!error) {
      return;
    }

    lastError = error;

    if (!isFetchNetworkError(error) || attempt === 2) {
      break;
    }

    await wait(700 * (attempt + 1));
  }

  if (lastError) {
    throw lastError;
  }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    gender: "man" as "man" | "woman",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Auth session check failed", error);
      }
    };

    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signupSchema.parse(formData);
      setLoading(true);

      await runAuthWithRetry(async () => {
        const { error } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            data: {
              name: validated.name,
              mobile_number: validated.mobile,
              gender: validated.gender,
              location: validated.location,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (!error) {
          return { error: null };
        }

        if (!isFetchNetworkError(error)) {
          return { error };
        }

        try {
          await runAuthViaProxy({
            action: "signup",
            email: validated.email,
            password: validated.password,
            redirectTo: `${window.location.origin}/`,
            data: {
              name: validated.name,
              mobile_number: validated.mobile,
              gender: validated.gender,
              location: validated.location,
            },
          });

          return { error: null };
        } catch (proxyError) {
          return {
            error:
              proxyError instanceof Error
                ? proxyError
                : new Error("Error creating account"),
          };
        }
      });

      toast.success("Account created! Redirecting...");
      navigate("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (isFetchNetworkError(error)) {
        console.error("Auth signup network error", {
          origin: window.location.origin,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          error,
        });
        toast.error(NETWORK_ERROR_MESSAGE);
      } else {
        toast.error(error.message || "Error creating account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = loginSchema.parse({
        email: formData.email,
        password: formData.password,
      });
      setLoading(true);

      await runAuthWithRetry(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });

        if (!error) {
          return { error: null };
        }

        if (!isFetchNetworkError(error)) {
          return { error };
        }

        try {
          const proxyResult = await runAuthViaProxy({
            action: "signin",
            email: validated.email,
            password: validated.password,
          });

          const accessToken = proxyResult.session?.access_token ?? proxyResult.access_token;
          const refreshToken = proxyResult.session?.refresh_token ?? proxyResult.refresh_token;

          if (!accessToken || !refreshToken) {
            return {
              error: new Error("Unable to establish login session. Please try again."),
            };
          }

          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          return { error: setSessionError };
        } catch (proxyError) {
          return {
            error:
              proxyError instanceof Error
                ? proxyError
                : new Error("Error signing in"),
          };
        }
      });

      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (isFetchNetworkError(error)) {
        console.error("Auth signin network error", {
          origin: window.location.origin,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          error,
        });
        toast.error(NETWORK_ERROR_MESSAGE);
      } else {
        toast.error(error.message || "Error signing in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <HomeLogo size="lg" showText={false} />
          </div>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Join OTHERS"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to find your match"
              : "Create your profile and find meaningful connections"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4" noValidate>
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter your mobile number"
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">I am a</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "man" | "woman" })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required={!isLogin}
                  >
                    <option value="man">Man</option>
                    <option value="woman">Woman</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State or Country"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: "", email: "", mobile: "", password: "", gender: "man", location: "" });
              }}
              className="text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
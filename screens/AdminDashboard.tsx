import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUIConfigStore } from "@/stores/uiConfigStore";
import { Shield, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();
  const { config, fetchConfig, updateFlag } = useUIConfigStore();

  useEffect(() => {
    if (isReady) {
      const role = user?.user_metadata?.role;
      if (!user || role !== "ADMIN") {
        navigate("/");
      }
    }
  }, [user, isReady, navigate]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (!isReady || !user || user.user_metadata?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Verifying administrative access...</p>
      </div>
    );
  }

  const handleToggle = async (key: string, currentValue: boolean) => {
    await updateFlag(key, !currentValue);
  };

  // Helper to format camelCase keys (e.g. "showCarLoan" -> "Show Car Loan")
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />
      <div className="py-8">
        {/* Admin Header */}
        <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Settings</h1>
              <span className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-primary/20">
                System Admin
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Configure global application settings and feature visibility.</p>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[350px] shadow-sm relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">UI Toggles & Features</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Control the visibility of individual navigation links, modules, and headers.</p>
            </div>

            {/* Dynamic Sections Grid */}
            <div className="space-y-6">
              <div className="border border-border rounded-xl bg-muted/25 p-5">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-primary">Navbar Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {config.navbar &&
                    Object.entries(config.navbar).map(([key, val]) => {
                      const fullKey = `navbar.${key}`;
                      const value = val as boolean;
                      return (
                        <div
                          key={fullKey}
                          className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                        >
                          <span className="text-sm font-semibold text-foreground">{formatLabel(key)}</span>
                          <button
                            onClick={() => handleToggle(fullKey, value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${value ? "bg-primary" : "bg-muted"
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="border border-border rounded-xl bg-muted/25 p-5">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-primary">Homepage Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {config.sections &&
                    Object.entries(config.sections)
                      .filter(([key]) => !key.startsWith("hideFooter"))
                      .map(([key, val]) => {
                        const fullKey = `sections.${key}`;
                        const value = val as boolean;
                        return (
                          <div
                            key={fullKey}
                            className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                          >
                            <span className="text-sm font-semibold text-foreground">{formatLabel(key)}</span>
                            <button
                              onClick={() => handleToggle(fullKey, value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${value ? "bg-primary" : "bg-muted"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"
                                  }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                </div>
              </div>

              <div className="border border-border rounded-xl bg-muted/25 p-5">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-primary">Footer Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {config.sections &&
                    Object.entries(config.sections)
                      .filter(([key]) => key.startsWith("hideFooter"))
                      .map(([key, val]) => {
                        const fullKey = `sections.${key}`;
                        const value = val as boolean;
                        return (
                          <div
                            key={fullKey}
                            className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                          >
                            <span className="text-sm font-semibold text-foreground">{formatLabel(key)}</span>
                            <button
                              onClick={() => handleToggle(fullKey, value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${value ? "bg-primary" : "bg-muted"
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"
                                  }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

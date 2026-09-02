import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUIConfigStore } from "@/stores/uiConfigStore";
import {
  Shield, Loader2, ChevronDown, ChevronRight, Sliders,
  ShieldCheck, FileText, Check, X, Search, ExternalLink,
  Hourglass, AlertCircle, RefreshCw
} from "lucide-react";
import { credupeApi } from "@/lib/credupe-api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { config, fetchConfig, updateFlag } = useUIConfigStore();
  const [eduExpanded, setEduExpanded] = useState(false);
  const [persExpanded, setPersExpanded] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"ui-config" | "kyc">("ui-config");

  // Documents/KYC State
  const [docs, setDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [expandedPartners, setExpandedPartners] = useState<Record<string, boolean>>({});
  const [expandedPreviews, setExpandedPreviews] = useState<Record<string, boolean>>({});

  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const res = await credupeApi.documents.adminList();
      setDocs(res.items || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch uploaded documents",
        variant: "destructive",
      });
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleVerify = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const reason = status === "REJECTED" ? rejectionReasons[id] : undefined;
      await credupeApi.documents.adminVerify(id, status, reason);
      toast({
        title: status === "VERIFIED" ? "Document Verified" : "Document Rejected",
        description: `The document status has been successfully updated.`,
      });
      if (status === "REJECTED") {
        setRejectingDocId(null);
        setRejectionReasons((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
      fetchDocs();
    } catch (err) {
      toast({
        title: "Verification Failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeTab === "kyc") {
      fetchDocs();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDocs();
  }, []);

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

  // Group documents by partner (filtered by search and status)
  const filteredDocs = docs.filter((d) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (d.ownerName && d.ownerName.toLowerCase().includes(query)) ||
      (d.businessName && d.businessName.toLowerCase().includes(query)) ||
      (d.ownerEmail && d.ownerEmail.toLowerCase().includes(query)) ||
      (d.partnerCode && d.partnerCode.toLowerCase().includes(query)) ||
      (d.fileName && d.fileName.toLowerCase().includes(query)) ||
      (d.id && d.id.toLowerCase().includes(query));

    const isReuploaded = (d.version > 1 && d.status === "UPLOADED");
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "REUPLOADED" ? isReuploaded : d.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const groupedByPartner = filteredDocs.reduce((groups, doc) => {
    const partnerId = doc.ownerUserId;
    if (!groups[partnerId]) {
      groups[partnerId] = {
        ownerName: doc.ownerName,
        ownerUserId: doc.ownerUserId,
        ownerEmail: doc.ownerEmail,
        businessName: doc.businessName,
        contactPerson: doc.contactPerson,
        partnerCode: doc.partnerCode,
        hasReuploaded: false,
        documents: [],
      };
    }
    if (doc.version > 1 && doc.status === "UPLOADED") {
      groups[partnerId].hasReuploaded = true;
    }
    groups[partnerId].documents.push(doc);
    return groups;
  }, {} as Record<string, any>);

  const partnersList = Object.values(groupedByPartner);
  const pendingCount = docs.filter((d) => d.status === "UPLOADED").length;

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

        {/* Dashboard Sidebar & Content Wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
            <button
              onClick={() => setActiveTab("ui-config")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                activeTab === "ui-config"
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border-transparent"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>UI Configs</span>
            </button>
            <button
              onClick={() => setActiveTab("kyc")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                activeTab === "kyc"
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border-transparent"
              }`}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                <span>KYC Verification</span>
              </span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8 min-h-[450px] shadow-sm relative overflow-hidden">
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

            {activeTab === "ui-config" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">UI Toggles & Features</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Control the visibility of individual navigation links, modules, and headers.</p>
                </div>

                {/* Dynamic Sections Grid */}
                <div className="space-y-6">
                  <div className="border border-border rounded-xl bg-muted/25 p-5 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider text-primary">Navbar Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {config.navbar &&
                          Object.entries(config.navbar)
                            .filter(([_, val]) => typeof val === "boolean")
                            .map(([key, val]) => {
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

                    {/* Sub-sections dropdowns */}
                    <div className="space-y-4 pt-4 border-t border-border/40">
                      {/* Education Loan Dropdown */}
                      <div className="border border-border rounded-xl bg-background overflow-hidden shadow-sm">
                        <button
                          onClick={() => setEduExpanded(!eduExpanded)}
                          className="w-full flex items-center justify-between p-4 font-bold text-sm text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <span className="flex items-center gap-2">Education Loan Banks Visibility Settings</span>
                          {eduExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        {eduExpanded && (
                          <div className="p-5 border-t border-border bg-muted/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {config.navbar?.educationLoan &&
                              Object.entries(config.navbar.educationLoan).map(([key, val]) => {
                                const fullKey = `navbar.educationLoan.${key}`;
                                const value = val as boolean;
                                return (
                                  <div
                                    key={fullKey}
                                    className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/20 transition-all duration-200"
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
                        )}
                      </div>

                      {/* Personal Loan Dropdown */}
                      <div className="border border-border rounded-xl bg-background overflow-hidden shadow-sm">
                        <button
                          onClick={() => setPersExpanded(!persExpanded)}
                          className="w-full flex items-center justify-between p-4 font-bold text-sm text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <span className="flex items-center gap-2">Personal Loan Banks Visibility Settings</span>
                          {persExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        {persExpanded && (
                          <div className="p-5 border-t border-border bg-muted/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {config.navbar?.personalLoan &&
                              Object.entries(config.navbar.personalLoan).map(([key, val]) => {
                                const fullKey = `navbar.personalLoan.${key}`;
                                const value = val as boolean;
                                return (
                                  <div
                                    key={fullKey}
                                    className="flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/20 transition-all duration-200"
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
                        )}
                      </div>
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
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">KYC Verification</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Inspect and approve or reject documents uploaded by partners.
                    </p>
                  </div>

                  {/* Status Filters */}
                  <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit text-xs font-semibold shrink-0 flex-wrap">
                    {[
                      { id: "ALL", label: "ALL" },
                      { id: "UPLOADED", label: "PENDING" },
                      { id: "REUPLOADED", label: "RE-UPLOADED" },
                      { id: "VERIFIED", label: "VERIFIED" },
                      { id: "REJECTED", label: "REJECTED" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md transition-all ${
                          statusFilter === tab.id
                            ? "bg-background text-foreground shadow-sm animate-in fade-in duration-200"
                            : "text-muted-foreground hover:text-foreground"
                        } ${tab.id === "REUPLOADED" && statusFilter === "REUPLOADED" ? "text-amber-600 dark:text-amber-400 font-bold" : ""}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by partner name or file name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Partners List */}
                {loadingDocs ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <p className="text-xs text-muted-foreground">Loading documents...</p>
                  </div>
                ) : partnersList.length === 0 ? (
                  <div className="text-center py-16 border border-dashed rounded-xl bg-muted/10">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">No matching documents found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try adjusting your search query or status filter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {partnersList.map((partner: any) => {
                      const isExpanded = expandedPartners[partner.ownerUserId] ?? false;

                      return (
                        <div
                          key={partner.ownerUserId}
                          className={`border rounded-xl p-5 shadow-sm transition-all duration-200 ${
                            partner.hasReuploaded
                              ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                              : "border-border bg-muted/10"
                          }`}
                        >
                          {/* Partner Collapsible Header */}
                          <div
                            onClick={() =>
                              setExpandedPartners({
                                ...expandedPartners,
                                [partner.ownerUserId]: !isExpanded,
                              })
                            }
                            className="flex items-center justify-between cursor-pointer select-none hover:opacity-80 transition-all duration-150"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-muted-foreground shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-primary transition duration-200" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 transition duration-200" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                                    {partner.contactPerson || partner.ownerName}
                                  </h3>
                                  {partner.businessName && (
                                    <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                      {partner.businessName}
                                    </span>
                                  )}
                                  {partner.partnerCode && (
                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                      {partner.partnerCode}
                                    </span>
                                  )}
                                  {partner.hasReuploaded && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                      <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Reuploaded KYC
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                  {partner.ownerEmail ? `${partner.ownerEmail} · ` : ""}ID: {partner.ownerUserId}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                              {partner.documents.length} File(s)
                            </span>
                          </div>

                          {/* Partner Documents List (Rendered conditionally as dropdown/accordion) */}
                          {isExpanded && (
                            <div className="space-y-3 pt-4 border-t border-border/40 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                              {partner.documents.map((d: any) => {
                                const apiBaseUrl = credupeApi.base.startsWith("http")
                                  ? credupeApi.base
                                  : typeof window !== "undefined" && window.location.hostname === "localhost"
                                  ? `http://localhost:8787${credupeApi.base}`
                                  : credupeApi.base;

                                const viewUrl = `${apiBaseUrl}/documents/${d.id}/view?token=${credupeApi.tokens.getAccess() || ""}`;
                                const isPreviewExpanded = expandedPreviews[d.id] ?? false;

                                const statusColors: Record<string, string> = {
                                  UPLOADED: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                                  VERIFIED: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
                                  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                                };

                                const isDocReuploaded = (d.version > 1 && d.status === "UPLOADED");

                                return (
                                  <div
                                    key={d.id}
                                    className={`bg-card border rounded-lg p-3 space-y-3 transition-all ${
                                      isDocReuploaded
                                        ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                                        : "border-border/60"
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                          isDocReuploaded
                                            ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                                            : "bg-primary/10 text-primary"
                                        }`}>
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold text-foreground">{d.fileName}</p>
                                            {d.version > 1 && (
                                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                v{d.version}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold">
                                              {d.tag}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                              {isDocReuploaded
                                                ? `Re-uploaded ${new Date(d.updatedAt || d.createdAt).toLocaleDateString("en-IN")}`
                                                : `Uploaded ${new Date(d.createdAt).toLocaleDateString("en-IN")}`}
                                            </span>
                                          </div>
                                          {d.rejectionReason && (
                                            <p className="text-[10px] text-red-500 font-medium mt-1">
                                              Reason: "{d.rejectionReason}"
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        {isDocReuploaded ? (
                                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                            <RefreshCw className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" /> RE-UPLOADED (v{d.version})
                                          </span>
                                        ) : (
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColors[d.status] || "bg-muted text-muted-foreground"}`}>
                                            {d.status === "UPLOADED" ? "PENDING" : d.status}
                                          </span>
                                        )}

                                        <button
                                          onClick={() =>
                                            setExpandedPreviews((prev) => ({
                                              ...prev,
                                              [d.id]: !isPreviewExpanded,
                                            }))
                                          }
                                          className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold transition hover:shadow-sm bg-card ${
                                            isPreviewExpanded
                                              ? "text-primary border-primary bg-primary/5"
                                              : "text-muted-foreground hover:text-foreground border-border"
                                          }`}
                                          title="Toggle Preview"
                                        >
                                          {isPreviewExpanded ? "Hide" : "Preview"}
                                        </button>

                                        <a
                                          href={viewUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded-lg bg-card transition hover:shadow-sm"
                                          title="View Document"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      </div>
                                    </div>

                                    {/* Inline Document Preview & Actions */}
                                    {isPreviewExpanded && (
                                      <div className="mt-3 pt-3 border-t border-border/40 animate-in fade-in duration-200 space-y-4">
                                        {d.mimeType?.startsWith("image/") ||
                                        /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(d.fileName) ? (
                                          <img
                                            src={viewUrl}
                                            alt={d.fileName}
                                            className="max-w-full max-h-[450px] object-contain rounded-lg border border-border mx-auto bg-muted/10 shadow-sm"
                                          />
                                        ) : d.mimeType === "application/pdf" ||
                                          /\.(pdf)$/i.test(d.fileName) ? (
                                          <iframe
                                            src={viewUrl}
                                            title={d.fileName}
                                            className="w-full h-[500px] rounded-lg border border-border shadow-sm bg-muted/10"
                                          />
                                        ) : (
                                          <div className="text-center py-6 bg-muted/20 rounded-lg border border-border">
                                            <p className="text-xs text-muted-foreground">
                                              Preview not available for this file type.
                                            </p>
                                            <a
                                              href={viewUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-xs text-primary font-semibold mt-2 inline-flex items-center gap-1"
                                            >
                                              Download File <ExternalLink className="w-3 h-3" />
                                            </a>
                                          </div>
                                        )}

                                        {/* Verification Actions (Shown below the image/preview) */}
                                        {d.status === "UPLOADED" && (
                                          <div className="flex flex-col space-y-2 pt-3 border-t border-border/40">
                                            {rejectingDocId !== d.id ? (
                                              <div className="flex gap-2 justify-end">
                                                <button
                                                  onClick={() => setRejectingDocId(d.id)}
                                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/20 font-semibold transition"
                                                >
                                                  <X className="w-3.5 h-3.5" /> Reject
                                                </button>
                                                <button
                                                  onClick={() => handleVerify(d.id, "VERIFIED")}
                                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-sm"
                                                >
                                                  <Check className="w-3.5 h-3.5" /> Verify
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="bg-muted/30 rounded-lg border border-border/80 p-3 space-y-2 animate-in fade-in-50 duration-200">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                  Specify Rejection Reason
                                                </label>
                                                <input
                                                  type="text"
                                                  placeholder="E.g., Document image is blurry or expired"
                                                  value={rejectionReasons[d.id] || ""}
                                                  onChange={(e) =>
                                                    setRejectionReasons({
                                                      ...rejectionReasons,
                                                      [d.id]: e.target.value,
                                                    })
                                                  }
                                                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                  <button
                                                    onClick={() => setRejectingDocId(null)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground transition border border-transparent"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    onClick={() => handleVerify(d.id, "REJECTED")}
                                                    disabled={!rejectionReasons[d.id]?.trim()}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 shadow-sm"
                                                  >
                                                    Confirm Rejection
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

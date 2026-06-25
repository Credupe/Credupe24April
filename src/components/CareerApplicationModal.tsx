import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CareerApplicationModal = ({ trigger }: { trigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", resume: null as File | null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || !/^\+?[\d\s-]{7,15}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.resume) e.resume = "Please upload your resume";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    toast({ title: "Application submitted!", description: "Our team will review your profile and get back to you." });
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", phone: "", resume: null });
        setErrors({});
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
            <p className="text-muted-foreground text-sm">Your application has been received. Our team will review your profile and reach out if there's a match.</p>
            <Button className="mt-6" onClick={() => handleClose(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Apply to CreduPe</DialogTitle>
              <p className="text-sm text-muted-foreground">Fill in your details and upload your resume.</p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="resume">Resume (PDF, DOC)</Label>
                <div className="mt-1">
                  <label htmlFor="resume" className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{form.resume ? form.resume.name : "Click to upload your resume"}</span>
                  </label>
                  <input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })} />
                </div>
                {errors.resume && <p className="text-xs text-destructive mt-1">{errors.resume}</p>}
              </div>
              <Button type="submit" className="w-full gap-2">
                <Mail className="w-4 h-4" /> Submit Application
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareerApplicationModal;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, Users, Phone, MapPin, MessageSquare } from "lucide-react";

const SafetyTips = () => {
  const navigate = useNavigate();

  const safetyCategories = [
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Protect Your Personal Information",
      tips: [
        "Never share your home address until you know someone well",
        "Keep financial information private (bank details, credit cards)",
        "Use the platform's messaging system before sharing personal contact",
        "Be cautious about sharing your workplace location",
        "Don't share passwords or security questions"
      ]
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: "Recognize Red Flags",
      tips: [
        "Requests for money or financial help are major warning signs",
        "Inconsistent stories or details that don't add up",
        "Reluctance to video chat or meet in person after extended time",
        "Pressure to move communication off the platform quickly",
        "Love bombing or excessive flattery very early on"
      ]
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Safe First Meetings",
      tips: [
        "Always meet in a public place (cafe, restaurant, park)",
        "Tell a friend or family member your plans",
        "Share your live location with someone you trust",
        "Arrange your own transportation",
        "Have an exit plan if you feel uncomfortable"
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: "Verify Before Meeting",
      tips: [
        "Video chat before meeting in person",
        "Look them up on social media to verify identity",
        "Do a reverse image search on profile photos",
        "Trust your instincts if something feels off",
        "Take your time—don't rush into meeting"
      ]
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-primary" />,
      title: "During Your Date",
      tips: [
        "Keep your phone charged and accessible",
        "Don't leave drinks unattended",
        "Limit alcohol consumption, especially on first dates",
        "Stay in public areas until you're comfortable",
        "Have a code word with friends for emergencies"
      ]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Online Communication Safety",
      tips: [
        "Report suspicious or inappropriate behavior",
        "Block users who make you uncomfortable",
        "Don't feel obligated to respond to everyone",
        "Keep conversations respectful and appropriate",
        "Screenshot concerning messages as evidence"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Safety Center</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Safety Is Our Priority
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            At OTHERS, we're committed to providing a safe environment for everyone. Follow these guidelines to protect yourself while building meaningful connections.
          </p>
        </div>
      </section>

      {/* Safety Tips */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safetyCategories.map((category, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <div className="bg-primary/20 rounded-full w-2 h-2 mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Resources */}
        <section className="mt-16 p-8 bg-destructive/5 rounded-2xl border border-destructive/20">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h3 className="text-2xl font-bold text-foreground">Emergency Resources</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            If you ever feel you're in immediate danger, please contact local emergency services immediately. Here are some resources that may help:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Emergency Services</h4>
              <p className="text-muted-foreground text-sm">Dial 100 (Police) or 112 (Emergency)</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Women Helpline</h4>
              <p className="text-muted-foreground text-sm">Dial 181 (24/7 Support)</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Cyber Crime</h4>
              <p className="text-muted-foreground text-sm">Report at cybercrime.gov.in</p>
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Report Suspicious Activity
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you encounter any suspicious behavior or feel unsafe, please report it immediately. We take all reports seriously and investigate thoroughly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="destructive">
              Report a User
            </Button>
            <Button size="lg" variant="outline">
              Contact Support
            </Button>
          </div>
        </section>
      </main>

      {/* Additional Resources */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Additional Safety Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-border bg-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/blog/online-dating-safety")}>
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Online Dating Safety Guide</h4>
                <p className="text-sm text-muted-foreground">Comprehensive guide to staying safe</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/privacy")}>
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Privacy Policy</h4>
                <p className="text-sm text-muted-foreground">How we protect your data</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/terms")}>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Community Guidelines</h4>
                <p className="text-sm text-muted-foreground">Our standards for behavior</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} OTHERS. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <button onClick={() => navigate("/terms")} className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </button>
            <button onClick={() => navigate("/privacy")} className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </button>
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SafetyTips;
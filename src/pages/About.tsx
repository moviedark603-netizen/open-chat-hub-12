import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Shield, Users, Globe, Target, Lightbulb, MessageSquare } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Authentic Connections",
      description: "We believe in fostering genuine relationships built on honesty and mutual respect. No fake profiles, no games—just real people looking for meaningful connections."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Safety First",
      description: "Your security is our top priority. We employ advanced verification systems, encrypted communications, and a dedicated safety team to ensure a protected environment."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Inclusive Community",
      description: "OTHERS welcomes everyone regardless of background, identity, or orientation. We celebrate diversity and create a space where everyone can find their community."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Local Focus",
      description: "We connect you with people nearby, making it easier to meet in person and build lasting relationships within your community."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50+", label: "Cities Covered" },
    { number: "5,000+", label: "Connections Made" },
    { number: "98%", label: "User Satisfaction" }
  ];

  const team = [
    {
      role: "Our Mission",
      description: "To create a world where meaningful connections are accessible to everyone. We're building technology that brings people together in authentic ways, helping them form relationships that enrich their lives."
    },
    {
      role: "Our Vision",
      description: "We envision a future where distance and social barriers no longer prevent people from finding their community. Through innovative technology and a commitment to safety, we're making that vision a reality."
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
          <h1 className="text-xl font-bold text-foreground">About Us</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-gradient-to-br from-primary to-accent rounded-full p-3">
              <MessageSquare className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About OTHERS
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to help people find meaningful connections in their local communities. OTHERS is more than just a platform—it's a movement toward authentic human connection in the digital age.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h3>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                OTHERS was born from a simple observation: in an increasingly connected world, many people feel more isolated than ever. Despite having thousands of online "friends," meaningful, real-world connections have become harder to form.
              </p>
              <p>
                We founded OTHERS with a clear mission: to bridge the gap between online and offline relationships. We believe that technology should bring people together, not drive them apart. Our platform is designed to facilitate genuine connections—the kind that lead to real friendships, meaningful relationships, and vibrant communities.
              </p>
              <p>
                What sets us apart is our focus on local connections. While other platforms optimize for engagement and time spent scrolling, we optimize for real meetings and lasting relationships. We want you to find people in your area who share your interests, values, and outlook on life.
              </p>
              <p>
                Today, OTHERS serves thousands of users across India, and we're growing every day. Every new connection made on our platform—whether it leads to friendship, romance, or simply a great conversation—validates our belief that people are looking for something more genuine than what traditional social media offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-primary to-accent py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">{value.title}</h4>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((item, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {index === 0 ? (
                      <Target className="w-8 h-8 text-primary" />
                    ) : (
                      <Lightbulb className="w-8 h-8 text-primary" />
                    )}
                    <h4 className="text-2xl font-bold text-foreground">{item.role}</h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">What We Do</h3>
            <div className="space-y-6 text-muted-foreground">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-xl font-semibold text-foreground mb-3">Connect People Locally</h4>
                <p>Our location-based technology helps you discover people in your area who share your interests. Whether you're looking for friends, romantic partners, or professional connections, OTHERS makes it easy to find your community.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-xl font-semibold text-foreground mb-3">Ensure Safe Interactions</h4>
                <p>We employ multiple layers of security including profile verification, encrypted messaging, and a dedicated team that monitors for suspicious activity. Your safety is never compromised.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-xl font-semibold text-foreground mb-3">Foster Genuine Relationships</h4>
                <p>Unlike platforms designed to keep you scrolling endlessly, we measure success by real connections formed. Our features encourage meaningful conversations and help relationships progress naturally.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-xl font-semibold text-foreground mb-3">Build Community</h4>
                <p>Beyond one-on-one connections, OTHERS helps you find and join groups of like-minded individuals. From hobby groups to professional networks, community building is at the heart of what we do.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Join Our Growing Community
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of something meaningful. Join thousands of others who are building genuine connections every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-primary to-accent text-lg px-8">
              Join OTHERS Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/blog")}>
              Read Our Blog
            </Button>
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
            <button onClick={() => navigate("/faq")} className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
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

export default About;
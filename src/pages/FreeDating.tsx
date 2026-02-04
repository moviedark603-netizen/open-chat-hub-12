import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Users, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Smartphone,
  Globe,
  Lock
} from "lucide-react";

const FreeDating = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "100% Free Forever",
      description: "No hidden fees, no premium walls. All features completely free.",
      tamil: "எப்போதும் 100% இலவசம்"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified profiles and strong privacy protection for your safety.",
      tamil: "பாதுகாப்பான சுயவிவரங்கள்"
    },
    {
      icon: Users,
      title: "Real People",
      description: "Connect with genuine singles looking for meaningful relationships.",
      tamil: "உண்மையான மக்கள்"
    },
    {
      icon: MessageSquare,
      title: "Unlimited Messaging",
      description: "Chat freely with matches without any restrictions or limits.",
      tamil: "வரம்பற்ற செய்திகள்"
    },
    {
      icon: Globe,
      title: "Local & Global",
      description: "Find love nearby or connect with people around the world.",
      tamil: "உள்ளூர் & உலகளாவிய"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data is encrypted and never shared with third parties.",
      tamil: "தனியுரிமை முதலில்"
    }
  ];

  const testimonials = [
    {
      name: "Priya S.",
      location: "Chennai",
      text: "I found my soulmate on OTHERS! The best free dating site I've ever used.",
      tamil: "நான் என் ஆத்ம துணையை OTHERS-ல் கண்டுபிடித்தேன்!"
    },
    {
      name: "Raj K.",
      location: "Mumbai",
      text: "Finally a dating app that's actually free. No hidden charges at all!",
      tamil: "உண்மையிலேயே இலவச டேட்டிங் செயலி!"
    },
    {
      name: "Anitha M.",
      location: "Bangalore",
      text: "Love how easy it is to connect with genuine people here.",
      tamil: "உண்மையான மக்களுடன் இணைவது மிகவும் எளிது!"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", tamil: "செயலில் உள்ள பயனர்கள்" },
    { value: "100%", label: "Free Features", tamil: "இலவச அம்சங்கள்" },
    { value: "1000+", label: "Success Stories", tamil: "வெற்றிக் கதைகள்" },
    { value: "24/7", label: "Support", tamil: "ஆதரவு" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20 text-sm md:text-base px-4 py-1">
              ✨ 100% Free Dating Site - No Credit Card Required
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Find Love for <span className="text-primary">Free</span>
              <br className="hidden md:block" />
              <span className="text-2xl md:text-4xl lg:text-5xl">இலவசமாக காதலைக் கண்டறியுங்கள்</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join India's fastest growing free dating community. Meet real singles, 
              make genuine connections, and find your perfect match - all completely free!
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              இந்தியாவின் வேகமாக வளர்ந்து வரும் இலவச டேட்டிங் சமூகத்தில் இணையுங்கள்
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="text-base md:text-lg px-8 py-6"
              >
                Start Free Today <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/")}
                className="text-base md:text-lg px-8 py-6"
              >
                Browse Profiles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground/70">{stat.tamil}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Why Choose OTHERS?</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Everything Free, Nothing Hidden
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              எல்லாம் இலவசம், மறைவானது எதுவுமில்லை
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border bg-card hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{feature.description}</p>
                    <p className="text-xs text-primary/70">{feature.tamil}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tamil Content Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                தமிழில் இலவச டேட்டிங் | Free Dating in Tamil
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p className="text-base md:text-lg leading-relaxed">
                <strong>OTHERS</strong> என்பது இந்தியாவின் சிறந்த இலவச டேட்டிங் தளமாகும். எங்கள் தளத்தில் நீங்கள் 
                உண்மையான மக்களை சந்திக்கலாம், புதிய நண்பர்களை உருவாக்கலாம், மற்றும் உங்கள் வாழ்க்கைத் துணையை 
                கண்டுபிடிக்கலாம் - அனைத்தும் முற்றிலும் இலவசம்!
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                எங்கள் தளம் தமிழ்நாடு, கேரளா, கர்நாடகா, ஆந்திரா மற்றும் இந்தியா முழுவதும் உள்ள 
                ஆயிரக்கணக்கான சிங்கிள்களை இணைக்கிறது. பணம் செலுத்த வேண்டிய அவசியமில்லை - 
                பதிவு செய்வது இலவசம், செய்திகள் அனுப்புவது இலவசம், எல்லாமே இலவசம்!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">🆓 இலவச பதிவு</h4>
                    <p className="text-sm">கிரெடிட் கார்டு தேவையில்லை, மறைக்கப்பட்ட கட்டணங்கள் இல்லை</p>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">💬 இலவச செய்திகள்</h4>
                    <p className="text-sm">வரம்பற்ற செய்திகள் அனுப்புங்கள்</p>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">🔒 பாதுகாப்பான சுயவிவரம்</h4>
                    <p className="text-sm">உங்கள் தனியுரிமை எங்கள் முன்னுரிமை</p>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">❤️ உண்மையான மக்கள்</h4>
                    <p className="text-sm">சரிபார்க்கப்பட்ட சுயவிவரங்கள் மட்டுமே</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Real People, Real Love Stories
            </h2>
            <p className="text-muted-foreground">உண்மையான மக்கள், உண்மையான காதல் கதைகள்</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-3 italic">"{testimonial.text}"</p>
                  <p className="text-xs text-primary/70 mb-4">"{testimonial.tamil}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Start Dating in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground">3 எளிய படிகளில் டேட்டிங் தொடங்குங்கள்</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Sign Up Free", desc: "Create your profile in minutes", tamil: "இலவசமாக பதிவு செய்யுங்கள்" },
              { step: "2", title: "Browse Profiles", desc: "Discover compatible singles", tamil: "சுயவிவரங்களை உலாவுங்கள்" },
              { step: "3", title: "Start Chatting", desc: "Connect and build relationships", tamil: "அரட்டை தொடங்குங்கள்" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{item.desc}</p>
                <p className="text-xs text-primary/70">{item.tamil}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            Join thousands of singles finding love on OTHERS
          </p>
          <p className="text-base text-muted-foreground mb-8">
            ஆயிரக்கணக்கான சிங்கிள்கள் OTHERS-ல் காதலைக் கண்டுபிடிக்கிறார்கள்
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-base md:text-lg px-8 py-6"
          >
            Join Free Now - இப்போதே இலவசமாக இணையுங்கள்
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/")} className="hover:text-foreground">Home</button></li>
                <li><button onClick={() => navigate("/blog")} className="hover:text-foreground">Blog</button></li>
                <li><button onClick={() => navigate("/safety")} className="hover:text-foreground">Safety Tips</button></li>
                <li><button onClick={() => navigate("/faq")} className="hover:text-foreground">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate("/terms")} className="hover:text-foreground">Terms</button></li>
                <li><button onClick={() => navigate("/privacy")} className="hover:text-foreground">Privacy</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-foreground">About Us</button></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold text-foreground mb-3">About OTHERS</h4>
              <p className="text-sm text-muted-foreground">
                OTHERS is India's leading free dating platform connecting singles for meaningful relationships. 
                100% free, 100% safe, 100% real.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                OTHERS என்பது இந்தியாவின் முன்னணி இலவச டேட்டிங் தளமாகும்.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} OTHERS - Free Dating Site India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FreeDating;

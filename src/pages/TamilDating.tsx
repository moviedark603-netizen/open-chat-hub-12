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
  MapPin
} from "lucide-react";

const TamilDating = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "இலவச டேட்டிங்",
      titleEn: "Free Dating",
      description: "முற்றிலும் இலவசமான டேட்டிங் அனுபவம். மறைக்கப்பட்ட கட்டணங்கள் இல்லை."
    },
    {
      icon: Shield,
      title: "பாதுகாப்பான சுயவிவரம்",
      titleEn: "Safe Profiles",
      description: "அனைத்து சுயவிவரங்களும் சரிபார்க்கப்படுகின்றன. உங்கள் பாதுகாப்பு எங்கள் முன்னுரிமை."
    },
    {
      icon: Users,
      title: "தமிழ் சமூகம்",
      titleEn: "Tamil Community",
      description: "தமிழ்நாடு மற்றும் உலகம் முழுவதும் உள்ள தமிழர்களை சந்தியுங்கள்."
    },
    {
      icon: MessageSquare,
      title: "வரம்பற்ற செய்திகள்",
      titleEn: "Unlimited Messages",
      description: "எந்த கட்டுப்பாடும் இல்லாமல் இலவசமாக செய்திகள் அனுப்புங்கள்."
    }
  ];

  const cities = [
    "சென்னை", "கோயம்புத்தூர்", "மதுரை", "திருச்சி", "சேலம்",
    "திருநெல்வேலி", "தூத்துக்குடி", "ஈரோடு", "வேலூர்", "திருப்பூர்"
  ];

  const articles = [
    {
      title: "தமிழ் டேட்டிங் குறிப்புகள்",
      titleEn: "Tamil Dating Tips",
      excerpt: "வெற்றிகரமான உறவுக்கான முக்கிய குறிப்புகள். முதல் சந்திப்பில் என்ன பேசுவது, எப்படி நல்ல முதல் அபிப்ராயத்தை உருவாக்குவது.",
      category: "டேட்டிங்"
    },
    {
      title: "ஆன்லைன் பாதுகாப்பு",
      titleEn: "Online Safety",
      excerpt: "ஆன்லைன் டேட்டிங்கில் பாதுகாப்பாக இருப்பது எப்படி. உங்கள் தனியுரிமையை பாதுகாக்க வழிகள்.",
      category: "பாதுகாப்பு"
    },
    {
      title: "உறவு ஆலோசனை",
      titleEn: "Relationship Advice",
      excerpt: "நீண்ட கால உறவுகளை எப்படி பராமரிப்பது. தொடர்பு மற்றும் நம்பிக்கையை கட்டமைப்பது.",
      category: "உறவு"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🇮🇳 தமிழ் டேட்டிங் | Tamil Dating
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              தமிழ் டேட்டிங் - இலவசமாக காதலைக் கண்டறியுங்கள்
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-2">
              Tamil Dating - Find Love for Free
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              தமிழ்நாடு மற்றும் உலகம் முழுவதும் உள்ள தமிழ் சிங்கிள்களை சந்தியுங்கள். 
              பதிவு இலவசம், செய்திகள் இலவசம், எல்லாமே இலவசம்!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="text-base md:text-lg px-8 py-6"
              >
                இலவசமாக இணையுங்கள் <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/")}
                className="text-base md:text-lg px-8 py-6"
              >
                சுயவிவரங்களை பாருங்கள்
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              ஏன் OTHERS-ஐ தேர்வு செய்ய வேண்டும்?
            </h2>
            <p className="text-muted-foreground">Why Choose OTHERS?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border bg-card hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-primary/70 mb-3">{feature.titleEn}</p>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tamil Content for SEO */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              தமிழ் டேட்டிங் பற்றி | About Tamil Dating
            </h2>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    தமிழ்நாட்டில் இலவச ஆன்லைன் டேட்டிங்
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    OTHERS என்பது தமிழ்நாட்டில் மிகவும் பிரபலமான இலவச டேட்டிங் தளமாகும். 
                    சென்னை, கோயம்புத்தூர், மதுரை, திருச்சி மற்றும் பிற நகரங்களில் 
                    ஆயிரக்கணக்கான தமிழ் சிங்கிள்கள் எங்கள் தளத்தில் தங்கள் வாழ்க்கைத் துணையை 
                    தேடி வருகிறார்கள்.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    எங்கள் தளம் முற்றிலும் இலவசம் - பதிவு செய்வது இலவசம், சுயவிவரங்களை 
                    பார்ப்பது இலவசம், செய்திகள் அனுப்புவது இலவசம். மறைக்கப்பட்ட கட்டணங்கள் 
                    எதுவும் இல்லை!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    தமிழ் திருமண தேடல் | Tamil Matrimony Search
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    நீங்கள் தீவிரமான உறவு அல்லது திருமணத்தை தேடுகிறீர்களா? OTHERS 
                    தளத்தில் நீங்கள் உங்கள் விருப்பங்களுக்கு ஏற்ற பொருத்தமான நபரை 
                    எளிதாக கண்டுபிடிக்கலாம்.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>சரிபார்க்கப்பட்ட சுயவிவரங்கள்</li>
                    <li>வயது, இருப்பிடம், கல்வி மூலம் தேடுங்கள்</li>
                    <li>பாதுகாப்பான தனிப்பட்ட செய்திகள்</li>
                    <li>புகைப்படங்கள் மற்றும் வீடியோ பகிர்வு</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    தமிழ்நாடு நகரங்கள் | Cities in Tamil Nadu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {city}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-4 text-sm">
                    இந்த அனைத்து நகரங்களிலும் OTHERS பயனர்கள் உள்ளனர். உங்கள் 
                    அருகில் உள்ள சிங்கிள்களை இப்போதே கண்டுபிடியுங்கள்!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tamil Articles */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              டேட்டிங் கட்டுரைகள் | Dating Articles
            </h2>
            <p className="text-muted-foreground">உதவிகரமான குறிப்புகள் மற்றும் ஆலோசனைகள்</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {articles.map((article, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate("/blog")}>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{article.title}</h3>
                  <p className="text-xs text-primary/70 mb-3">{article.titleEn}</p>
                  <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/blog")}>
              மேலும் கட்டுரைகள் | More Articles <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            இன்றே இலவசமாக தொடங்குங்கள்!
          </h2>
          <p className="text-lg text-muted-foreground mb-2">Start Free Today!</p>
          <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
            ஆயிரக்கணக்கான தமிழ் சிங்கிள்கள் ஏற்கனவே OTHERS-ல் இணைந்துள்ளனர். 
            நீங்களும் இப்போதே இணையுங்கள்!
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-base md:text-lg px-8 py-6"
          >
            இலவச கணக்கு உருவாக்குங்கள் <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            © {new Date().getFullYear()} OTHERS - தமிழ் இலவச டேட்டிங் தளம்
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate("/terms")} className="text-sm text-muted-foreground hover:text-foreground">விதிமுறைகள்</button>
            <button onClick={() => navigate("/privacy")} className="text-sm text-muted-foreground hover:text-foreground">தனியுரிமை</button>
            <button onClick={() => navigate("/safety")} className="text-sm text-muted-foreground hover:text-foreground">பாதுகாப்பு</button>
            <button onClick={() => navigate("/free-dating")} className="text-sm text-muted-foreground hover:text-foreground">Free Dating</button>
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground">முகப்பு</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TamilDating;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: "building-meaningful-connections",
      title: "10 Tips for Building Meaningful Connections Online",
      excerpt: "Discover proven strategies to create lasting relationships in the digital age. From crafting the perfect profile to meaningful conversations.",
      category: "Relationships",
      date: "December 10, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800"
    },
    {
      id: "online-dating-safety",
      title: "The Complete Guide to Online Dating Safety",
      excerpt: "Stay safe while meeting new people online. Learn essential tips for protecting your privacy, spotting red flags, and safe meetup practices.",
      category: "Safety",
      date: "December 8, 2024",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800"
    },
    {
      id: "conversation-starters",
      title: "50 Conversation Starters That Actually Work",
      excerpt: "Break the ice with confidence! These proven conversation starters will help you make great first impressions and keep conversations flowing.",
      category: "Tips",
      date: "December 5, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800"
    },
    {
      id: "long-distance-relationships",
      title: "Making Long Distance Relationships Work",
      excerpt: "Distance doesn't have to be a barrier to love. Learn how couples maintain strong connections across miles with practical advice.",
      category: "Relationships",
      date: "December 3, 2024",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
    },
    {
      id: "profile-optimization",
      title: "How to Create a Dating Profile That Stands Out",
      excerpt: "Your profile is your first impression. Learn the secrets to creating an authentic, attractive profile that gets noticed.",
      category: "Tips",
      date: "November 30, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800"
    },
    {
      id: "first-date-ideas",
      title: "25 Creative First Date Ideas for Every Budget",
      excerpt: "From free outdoor adventures to special evening experiences, find the perfect first date idea that matches your style and budget.",
      category: "Dating",
      date: "November 28, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800"
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
          <h1 className="text-xl font-bold text-foreground">Blog & Resources</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Expert Advice & Tips
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Relationship Insights & Dating Tips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice, practical tips, and inspiring stories to help you navigate the world of modern dating and build meaningful relationships.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card 
              key={article.id} 
              className="border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated with Our Latest Tips
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Join our community and receive weekly relationship advice, dating tips, and success stories directly in your inbox.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg">
            Join OTHERS Today
          </Button>
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

export default Blog;
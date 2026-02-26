import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, MessageSquare } from "lucide-react";
import HomeLogo from "@/components/HomeLogo";

const FAQ = () => {
  const navigate = useNavigate();

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is OTHERS?",
          answer: "OTHERS is a modern social connection platform designed to help people find meaningful relationships in their local area. We use location-based technology to connect you with like-minded individuals nearby, making it easier to transition from online conversations to real-life connections."
        },
        {
          question: "How do I create an account?",
          answer: "Creating an account is simple and free! Click the 'Sign Up' button on our homepage, enter your email address, create a password, and verify your email. Then you can complete your profile by adding photos, a bio, and your interests."
        },
        {
          question: "Is OTHERS free to use?",
          answer: "Yes! OTHERS is completely free to join and use. You can create a profile, browse other users, send messages, and connect with people without any cost. We believe everyone deserves access to meaningful connections."
        },
        {
          question: "What makes OTHERS different from other dating apps?",
          answer: "OTHERS focuses on genuine, local connections. Our location-based matching helps you meet people in your area, making real-life meetups more accessible. We prioritize user safety, authentic profiles, and meaningful conversations over superficial swipes."
        }
      ]
    },
    {
      category: "Profile & Account",
      questions: [
        {
          question: "How do I edit my profile?",
          answer: "To edit your profile, log in and click on your profile icon. You can update your photos, bio, interests, location, and other details at any time. We recommend keeping your profile current for the best matching experience."
        },
        {
          question: "What should I include in my profile?",
          answer: "A great profile includes clear, recent photos of yourself, an engaging bio that showcases your personality, your interests and hobbies, and what you're looking for in a connection. Be authentic—the best connections come from honest representation."
        },
        {
          question: "Can I change my location?",
          answer: "Yes, you can update your location in your profile settings. This helps us show you people nearby and show your profile to users in your area. We recommend using your actual location for the best matching experience."
        },
        {
          question: "How do I delete my account?",
          answer: "To delete your account, go to your profile settings and select 'Delete Account.' Please note this action is permanent and will remove all your data, matches, and conversations. If you're having issues, consider contacting support first."
        }
      ]
    },
    {
      category: "Matching & Connections",
      questions: [
        {
          question: "How does matching work on OTHERS?",
          answer: "OTHERS uses location-based matching to show you profiles of people nearby. You can browse profiles, send connection requests, and start conversations with users who interest you. We focus on meaningful connections over random swipes."
        },
        {
          question: "How do I connect with someone?",
          answer: "When you find someone interesting, you can send them a connection request or message. If they're interested too, you can start chatting! We encourage thoughtful first messages that reference something from their profile."
        },
        {
          question: "Why can't I see many people in my area?",
          answer: "The number of users varies by location. If you're in a less populated area, you might see fewer profiles. Try expanding your location settings or check back later as new users join. You can also explore our community features."
        },
        {
          question: "Can I block or report someone?",
          answer: "Yes, your safety is our priority. You can block any user from their profile or conversation. To report inappropriate behavior, use the report button on their profile. Our team reviews all reports and takes appropriate action."
        }
      ]
    },
    {
      category: "Messaging",
      questions: [
        {
          question: "How do I send a message?",
          answer: "Once you've connected with someone, you can send them a message by clicking on their profile and selecting the message option. Start with something personal—reference their bio or photos for the best response."
        },
        {
          question: "Can I send photos or voice messages?",
          answer: "Yes! OTHERS supports photo sharing and voice messages in conversations. This helps you express yourself better and build stronger connections. Remember to use these features responsibly and respectfully."
        },
        {
          question: "Why aren't my messages being delivered?",
          answer: "If messages aren't delivering, check your internet connection. If the issue persists, the user may have blocked you or deleted their account. You can also try logging out and back in, or contact support for help."
        },
        {
          question: "Are my conversations private?",
          answer: "Yes, your conversations are private between you and the person you're chatting with. We use encryption to protect your messages. However, if someone reports a conversation, our safety team may review it."
        }
      ]
    },
    {
      category: "Safety & Privacy",
      questions: [
        {
          question: "How does OTHERS protect my privacy?",
          answer: "We take privacy seriously. Your personal information is encrypted and never shared with third parties without consent. We don't display your exact location to other users, and you control what information appears on your profile."
        },
        {
          question: "How do I stay safe while using OTHERS?",
          answer: "We recommend: never sharing personal financial information, meeting in public places for first dates, telling someone where you'll be, trusting your instincts, and reporting suspicious behavior. Visit our Safety Center for more tips."
        },
        {
          question: "What should I do if someone asks me for money?",
          answer: "Never send money to anyone you meet online. Requests for money are a major red flag and often indicate scam attempts. Report such users immediately through our reporting system, and block them from contacting you."
        },
        {
          question: "How do I report fake profiles?",
          answer: "If you suspect a profile is fake, click the report button on their profile and select 'Fake Profile.' Our team investigates all reports. Signs of fake profiles include professional-looking photos, vague bios, and requests to move off-platform quickly."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The app isn't loading properly. What should I do?",
          answer: "Try these steps: refresh the page, clear your browser cache, check your internet connection, or try a different browser. If problems persist, contact our support team with details about the issue you're experiencing."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a password reset link. If you don't receive it, check your spam folder or contact support for assistance."
        },
        {
          question: "Which browsers does OTHERS support?",
          answer: "OTHERS works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience and security."
        },
        {
          question: "How do I contact customer support?",
          answer: "You can reach our support team through the Help section in your profile settings. We typically respond within 24-48 hours. For urgent safety concerns, please use our emergency report feature."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <HomeLogo size="sm" showText={false} />
          <h1 className="text-xl font-bold text-foreground">Help Center</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about OTHERS. Can't find what you're looking for? Our support team is here to help.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
              {category.category}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq, index) => (
                <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Still Need Help */}
        <section className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center">
          <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Still Have Questions?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Our support team is ready to help you with any questions or concerns you might have.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/safety")}>
              Safety Center
            </Button>
          </div>
        </section>
      </main>

      {/* Quick Links */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-foreground text-center mb-6">
            Quick Links
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/blog")}>
              Blog & Tips
            </Button>
            <Button variant="outline" onClick={() => navigate("/safety")}>
              Safety Tips
            </Button>
            <Button variant="outline" onClick={() => navigate("/privacy")}>
              Privacy Policy
            </Button>
            <Button variant="outline" onClick={() => navigate("/terms")}>
              Terms of Service
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
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from "lucide-react";
import HomeLogo from "@/components/HomeLogo";

const articles: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}> = {
  "building-meaningful-connections": {
    title: "10 Tips for Building Meaningful Connections Online",
    category: "Relationships",
    date: "December 10, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200",
    content: [
      "In today's digital age, finding meaningful connections online has become increasingly common. Whether you're looking for friendship, romance, or professional networking, the internet offers countless opportunities to meet like-minded individuals. However, building genuine relationships in the virtual world requires intentionality and effort.",
      
      "## 1. Be Authentic in Your Profile",
      "Your online profile is your first impression. Instead of trying to present a perfect image, focus on being genuine. Share your real interests, hobbies, and what makes you unique. Authenticity attracts people who appreciate the real you, leading to more meaningful connections.",
      
      "## 2. Choose Quality Over Quantity",
      "It's tempting to connect with as many people as possible, but meaningful relationships require time and energy. Focus on building deeper connections with fewer people rather than superficial interactions with many. Quality conversations lead to lasting bonds.",
      
      "## 3. Ask Thoughtful Questions",
      "Move beyond surface-level small talk by asking questions that encourage deeper conversations. Instead of 'How are you?', try 'What's something that made you smile today?' or 'What are you passionate about?' These questions show genuine interest and create opportunities for meaningful dialogue.",
      
      "## 4. Practice Active Listening",
      "When engaging in online conversations, give your full attention. Respond to what the other person shares, ask follow-up questions, and show that you value their thoughts and experiences. Active listening builds trust and deepens connections.",
      
      "## 5. Share Your Vulnerabilities",
      "Meaningful connections often form when we allow ourselves to be vulnerable. Sharing your challenges, dreams, and fears (at appropriate times) creates space for deeper understanding and emotional connection. Vulnerability invites others to do the same.",
      
      "## 6. Be Consistent and Reliable",
      "Building trust takes time and consistency. Follow through on your commitments, respond to messages in a timely manner, and show up regularly. Reliability demonstrates that you value the relationship and can be counted on.",
      
      "## 7. Respect Boundaries",
      "Everyone has different comfort levels when it comes to sharing personal information and the pace of developing relationships. Respect others' boundaries and communicate your own clearly. Healthy boundaries are the foundation of any meaningful connection.",
      
      "## 8. Move Beyond Text When Ready",
      "While text-based communication is convenient, consider adding voice or video calls to your interactions when both parties are comfortable. Hearing someone's voice or seeing their expressions adds depth to the connection and helps build stronger bonds.",
      
      "## 9. Find Common Ground",
      "Shared interests, values, and experiences create natural connection points. Look for topics you both enjoy discussing, activities you could do together (even virtually), and values that align. Common ground provides a foundation for lasting relationships.",
      
      "## 10. Be Patient",
      "Meaningful connections don't happen overnight. Building trust, understanding, and genuine rapport takes time. Be patient with the process and allow relationships to develop naturally. The best connections are often worth the wait.",
      
      "## Conclusion",
      "Building meaningful connections online is absolutely possible with the right approach. By being authentic, intentional, and patient, you can form relationships that enrich your life and bring genuine joy. Remember, every lasting friendship or relationship started with a single conversation. Start yours today on OTHERS and discover the meaningful connections waiting for you."
    ]
  },
  "online-dating-safety": {
    title: "The Complete Guide to Online Dating Safety",
    category: "Safety",
    date: "December 8, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200",
    content: [
      "Online dating has revolutionized how people meet and form relationships. While it offers incredible opportunities to connect with others, it's essential to prioritize your safety throughout the process. This comprehensive guide covers everything you need to know to protect yourself while navigating the world of online dating.",
      
      "## Protecting Your Personal Information",
      "Your personal information is valuable and should be protected carefully. Never share your home address, workplace, financial information, or other sensitive details with someone you've just met online. Use the platform's messaging system rather than giving out your personal phone number or email immediately.",
      
      "## Creating a Safe Profile",
      "When setting up your dating profile, avoid using photos that reveal identifying information like your home, license plate, or workplace. Don't include your full name, and consider using a username that doesn't include personal identifiers. Be thoughtful about what you share in your bio.",
      
      "## Recognizing Red Flags",
      "Trust your instincts when something feels off. Common red flags include: requests for money or financial help, reluctance to video chat or meet in person, inconsistent stories, pressuring you to share personal information quickly, or making you feel uncomfortable in any way. If something seems too good to be true, it often is.",
      
      "## Verifying Identity",
      "Before meeting someone in person, take steps to verify they are who they claim to be. Video chat before meeting, do a reverse image search on their photos, and look them up on social media. A genuine person will understand and appreciate your caution.",
      
      "## Planning Safe First Meetings",
      "When you're ready to meet in person, always choose a public place like a coffee shop, restaurant, or park. Tell a friend or family member where you'll be and who you're meeting. Consider sharing your location with someone you trust. Never accept a ride from your date or go to a private location on a first meeting.",
      
      "## Trusting Your Instincts",
      "Your intuition is a powerful safety tool. If something feels wrong during a conversation or date, trust that feeling. You're never obligated to continue a conversation, respond to messages, or stay on a date that makes you uncomfortable. Your safety and comfort always come first.",
      
      "## Handling Unwanted Contact",
      "If someone becomes aggressive, inappropriate, or won't respect your boundaries, don't hesitate to block and report them. Most dating platforms have robust reporting systems. You don't owe anyone an explanation for ending contact, and setting boundaries is healthy and necessary.",
      
      "## Safe Transportation",
      "Always arrange your own transportation to and from dates. This ensures you can leave whenever you want and maintains control over your location. Consider using rideshare apps that allow you to share your trip details with trusted contacts.",
      
      "## Alcohol and Safety",
      "If you choose to drink on a date, do so responsibly. Never leave your drink unattended, and consider limiting alcohol consumption until you know the person better. Being alert helps you make better decisions and recognize potential dangers.",
      
      "## Building Trust Gradually",
      "Healthy relationships develop over time. Be wary of anyone who tries to rush intimacy or commitment. Take your time getting to know someone before sharing more personal information or increasing your vulnerability. Patience is an important part of staying safe.",
      
      "## Conclusion",
      "Online dating can be a wonderful way to meet new people, but safety should always be your priority. By following these guidelines, trusting your instincts, and taking sensible precautions, you can enjoy the benefits of online dating while protecting yourself. At OTHERS, we're committed to creating a safe environment for all our users. Stay safe, and happy connecting!"
    ]
  },
  "conversation-starters": {
    title: "50 Conversation Starters That Actually Work",
    category: "Tips",
    date: "December 5, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200",
    content: [
      "Starting a conversation with someone new can feel daunting, but having the right opening lines can make all the difference. These 50 conversation starters are designed to spark genuine interest and lead to meaningful exchanges.",
      
      "## Getting to Know You Questions",
      "1. What's the best thing that happened to you this week?\n2. If you could learn any skill instantly, what would it be?\n3. What's a hobby you've always wanted to try?\n4. What's your favorite way to spend a weekend?\n5. If you could travel anywhere tomorrow, where would you go?",
      
      "## Fun and Lighthearted Starters",
      "6. What's the last show you binge-watched?\n7. Do you prefer coffee or tea? (And how do you take it?)\n8. What's your go-to comfort food?\n9. Are you a morning person or night owl?\n10. What's the best meal you've ever had?",
      
      "## Deeper Connection Questions",
      "11. What's something you're really proud of?\n12. Who has had the biggest influence on your life?\n13. What's a goal you're currently working toward?\n14. What's the most valuable lesson you've learned?\n15. If you could change one thing about the world, what would it be?",
      
      "## Creative and Unique Questions",
      "16. If your life was a movie, what genre would it be?\n17. What would your superpower be?\n18. If you could have dinner with anyone (living or dead), who would it be?\n19. What's on your bucket list?\n20. If you could relive any day of your life, which would it be?",
      
      "## Interest-Based Starters",
      "21. What's the best book you've read recently?\n22. What kind of music are you into?\n23. Do you have any hidden talents?\n24. What's your favorite outdoor activity?\n25. Are you into sports? Which ones?",
      
      "## Thought-Provoking Questions",
      "26. What's something you've changed your mind about recently?\n27. What do you think makes a good relationship?\n28. How do you handle stress?\n29. What's the best advice you've ever received?\n30. What makes you laugh the most?",
      
      "## Situational Starters",
      "31. I noticed [something specific from their profile]. Tell me more about that!\n32. Your photos look like you love adventure. What's your favorite trip?\n33. We both love [shared interest]. How did you get into it?\n34. I see you're from [location]. What's your favorite thing about it?\n35. Your pet is adorable! What's their name and personality like?",
      
      "## Future-Focused Questions",
      "36. Where do you see yourself in five years?\n37. What's your dream job?\n38. If money wasn't an issue, what would you do with your time?\n39. What's something new you want to try this year?\n40. What's a place you'd love to live someday?",
      
      "## Playful Questions",
      "41. What's your most unpopular opinion?\n42. What's the weirdest food combination you enjoy?\n43. If you could be any animal, what would you be?\n44. What's a conspiracy theory you find interesting?\n45. What's your guilty pleasure?",
      
      "## Connection Building Questions",
      "46. What does your ideal day look like?\n47. What's something most people don't know about you?\n48. How do you like to show appreciation for people you care about?\n49. What's a tradition you love?\n50. What are you most looking forward to right now?",
      
      "## Tips for Using These Starters",
      "Remember, the best conversation starters are just the beginning. Listen actively to responses and ask follow-up questions. Show genuine curiosity about the other person's answers. Don't fire off questions like an interview—let the conversation flow naturally. And most importantly, share your own answers too to create a balanced exchange.",
      
      "## Conclusion",
      "Great conversations are the foundation of meaningful connections. With these 50 starters in your toolkit, you're ready to break the ice and build genuine relationships. Try them out on OTHERS and discover how a great conversation can lead to an amazing connection!"
    ]
  },
  "long-distance-relationships": {
    title: "Making Long Distance Relationships Work",
    category: "Relationships",
    date: "December 3, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
    content: [
      "Long distance relationships come with unique challenges, but they can also be incredibly rewarding. With the right approach, commitment, and communication, couples can maintain strong, loving relationships across any distance. Here's your comprehensive guide to making long distance love work.",
      
      "## The Reality of Long Distance",
      "Let's be honest: long distance relationships require extra effort. You'll miss physical presence, spontaneous dates, and the comfort of having your partner nearby. However, many couples find that distance actually strengthens their bond by forcing them to communicate more deeply and appreciate each other more fully.",
      
      "## Communication Is Everything",
      "In long distance relationships, communication becomes your lifeline. Establish regular check-ins that work for both schedules. Mix up your communication methods—texts for quick updates, voice calls for deeper conversations, and video chats for quality time. Be open about your feelings, including when you're struggling with the distance.",
      
      "## Creating Virtual Date Nights",
      "Just because you can't be together physically doesn't mean you can't have dates. Watch movies simultaneously, cook the same meal while video chatting, play online games together, or take virtual tours of museums and cities. Get creative and find activities you both enjoy.",
      
      "## Setting Goals and Timelines",
      "Having a plan helps long distance couples stay motivated. Discuss your timeline: When will you next see each other? What's the end goal—will one person relocate? Having milestones to look forward to makes the distance more bearable.",
      
      "## Maintaining Trust",
      "Trust is crucial in any relationship, but it's especially important when you can't physically be together. Be consistent, keep your promises, and stay honest. If jealousy or insecurity arises, address it openly rather than letting it fester.",
      
      "## Handling Time Zone Differences",
      "If you're in different time zones, find overlapping hours that work for both of you. Consider keeping a shared calendar. Be flexible and willing to occasionally adjust your schedule to accommodate your partner. Good morning and good night messages can bridge the gap.",
      
      "## Making the Most of Visits",
      "When you do get to see each other, make it count. Plan activities you've been looking forward to, but also leave room for relaxed, everyday moments. Don't put too much pressure on visits being perfect—normal life together is valuable too.",
      
      "## Maintaining Individual Lives",
      "While your relationship is important, maintain your own friendships, hobbies, and goals. A healthy long distance relationship involves two fulfilled individuals. This independence actually strengthens your partnership and gives you more to share with each other.",
      
      "## Dealing with Difficult Moments",
      "There will be hard days when the distance feels overwhelming. When this happens, communicate with your partner. Sometimes just expressing your feelings helps. Remember why you're doing this and the love that makes it worthwhile.",
      
      "## Surprising Each Other",
      "Small surprises can make a big impact. Send unexpected gifts, letters, or care packages. Order delivery to their home. Plan surprise virtual dates. These gestures show you're thinking of them and add excitement to the relationship.",
      
      "## Planning for the Future",
      "Have honest conversations about your future together. Discuss your goals, dreams, and how you envision closing the distance eventually. Shared goals keep you both working toward the same outcome.",
      
      "## Conclusion",
      "Long distance relationships aren't easy, but they're absolutely possible with the right mindset and effort. Many couples emerge from long distance periods with stronger communication skills, deeper trust, and a profound appreciation for each other. If you're starting a long distance connection on OTHERS, know that distance is just a temporary obstacle on the way to something beautiful."
    ]
  },
  "profile-optimization": {
    title: "How to Create a Dating Profile That Stands Out",
    category: "Tips",
    date: "November 30, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200",
    content: [
      "Your dating profile is your first impression in the online dating world. A well-crafted profile can mean the difference between being overlooked and making meaningful connections. Here's how to create a profile that authentically represents you and attracts compatible matches.",
      
      "## Choosing the Right Photos",
      "Photos are the first thing people notice. Use recent photos that clearly show your face. Include a mix of close-ups and full-body shots. Show yourself doing activities you enjoy. Smile naturally—it makes you appear approachable. Avoid group photos as your main image, heavy filters, or photos that hide who you really are.",
      
      "## Writing an Engaging Bio",
      "Your bio should give people a sense of who you are beyond your photos. Be specific about your interests rather than generic. Instead of 'I love music,' try 'I'm obsessed with discovering new indie bands and going to live shows.' Specificity sparks conversation and helps you find compatible matches.",
      
      "## Showing Your Personality",
      "Let your unique personality shine through. Use humor if that's natural for you. Share quirky facts or unpopular opinions. The goal isn't to appeal to everyone—it's to attract people who appreciate the real you. Authenticity is far more attractive than a polished but generic profile.",
      
      "## Being Clear About What You Want",
      "Whether you're looking for something serious, casual dating, or friendship, be upfront about it. This saves time for everyone and helps you attract people with similar intentions. Clarity leads to better matches.",
      
      "## Prompts and Conversation Starters",
      "Many dating platforms include prompts to answer. Use these as opportunities to showcase your personality and give potential matches easy conversation starters. Answer prompts thoughtfully rather than with one-word responses.",
      
      "## Avoiding Common Mistakes",
      "Don't start with 'I don't know what to write here' or 'Just ask.' Avoid negativity like listing dealbreakers or complaining about dating. Don't exaggerate or misrepresent yourself. Skip overused phrases like 'looking for my partner in crime' or 'love to laugh.'",
      
      "## Updating Regularly",
      "Keep your profile fresh by updating photos and bio periodically. Add new interests, recent experiences, or updated goals. An active, current profile shows you're engaged in the dating process.",
      
      "## The Power of Specific Details",
      "Details make profiles memorable. Instead of 'I love food,' say 'I'm on a quest to find the best tacos in the city.' Instead of 'I enjoy traveling,' share 'My favorite trip was getting lost in Tokyo's hidden jazz bars.' Specifics create connection points.",
      
      "## Proofreading Matters",
      "Take time to check for spelling and grammar errors. A polished profile shows you care and put effort into presenting yourself. Ask a friend to review your profile for feedback.",
      
      "## Conclusion",
      "Your dating profile is an invitation for others to get to know you. By being authentic, specific, and thoughtful in your presentation, you'll attract matches who are genuinely compatible with who you are. Take the time to craft a profile you're proud of on OTHERS, and watch the meaningful connections follow!"
    ]
  },
  "first-date-ideas": {
    title: "25 Creative First Date Ideas for Every Budget",
    category: "Dating",
    date: "November 28, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200",
    content: [
      "First dates set the tone for potential relationships. The right activity can help you both relax, have fun, and get to know each other naturally. Here are 25 creative first date ideas organized by budget to help you plan the perfect outing.",
      
      "## Free First Date Ideas",
      "1. **Park Picnic**: Pack some snacks and find a scenic spot. The relaxed outdoor setting makes conversation flow naturally.\n\n2. **Sunset Walk**: Time your walk to catch the sunset at a local viewpoint. It's romantic and gives you beautiful scenery to enjoy together.\n\n3. **Farmers Market**: Stroll through local vendors, sample foods, and learn about each other's tastes.\n\n4. **Beach Day**: Whether swimming, building sandcastles, or just walking along the shore, the beach offers endless conversation opportunities.\n\n5. **Free Museum Day**: Many museums offer free admission days. Culture and conversation—perfect combination.",
      
      "## Budget-Friendly Dates (Under $20)",
      "6. **Coffee Shop Exploration**: Try a new local café. The casual setting is perfect for getting to know someone without too much pressure.\n\n7. **Food Truck Adventure**: Find a food truck park and sample different cuisines together.\n\n8. **Arcade Night**: Classic games bring out playful sides and create fun memories.\n\n9. **Bookstore Browse**: Explore together, share favorite books, and maybe grab coffee at the café.\n\n10. **Ice Cream Walk**: Get ice cream and take a leisurely stroll through a nice neighborhood or park.",
      
      "## Moderate Budget Dates ($20-50)",
      "11. **Cooking Class**: Learn to make something new together. It's interactive and you get to eat your creation!\n\n12. **Mini Golf**: Playful competition in a relaxed setting. Perfect for breaking the ice.\n\n13. **Trivia Night**: Test your knowledge at a local pub's trivia event. Teamwork reveals a lot about compatibility.\n\n14. **Pottery Painting**: Get creative together at a paint-your-own pottery studio.\n\n15. **Live Music**: Check out a local band at a small venue. Shared musical experiences create connection.",
      
      "## Adventurous Dates",
      "16. **Hiking**: Nature, exercise, and conversation. Choose a trail that matches both your fitness levels.\n\n17. **Kayaking or Paddleboarding**: Water activities are fun and create shared experiences.\n\n18. **Rock Climbing Gym**: Challenge yourselves and build trust literally and figuratively.\n\n19. **Escape Room**: Work together to solve puzzles. Great for seeing how you collaborate under pressure.\n\n20. **Bike Ride**: Explore your city on two wheels. Active dates feel less formal.",
      
      "## Unique and Memorable Dates",
      "21. **Stargazing**: Find a dark spot away from city lights. Bring blankets and maybe an astronomy app.\n\n22. **Volunteer Together**: Help at an animal shelter or community garden. Doing good together bonds you.\n\n23. **Comedy Show**: Laughter creates connection. Plus, you'll have something to discuss afterward.\n\n24. **Local Festival or Fair**: Seasonal events offer plenty of activities, food, and photo opportunities.\n\n25. **Cooking Together**: Pick a recipe neither of you has tried and cook dinner at home (once you're comfortable meeting privately).",
      
      "## Tips for First Date Success",
      "Choose an activity that allows for conversation—loud clubs or movies make talking difficult. Have a backup plan in case of weather or other issues. Keep it to a reasonable length—2-3 hours is ideal for a first date. Most importantly, focus on getting to know the person rather than impressing them.",
      
      "## Conclusion",
      "The best first date is one where both people feel comfortable and have fun. Use these ideas as inspiration, and don't be afraid to suggest something unique that reflects your personality. Whatever you choose, approach the date with genuine curiosity about your match. The memories you create together start with that first meeting. Found someone special on OTHERS? One of these dates might be just the beginning of your story!"
    ]
  }
};

const BlogArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  
  const article = articleId ? articles[articleId] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HomeLogo size="sm" showText={false} />
            <span className="text-sm text-muted-foreground">Back to Blog</span>
          </div>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Article Header */}
      <div className="w-full aspect-[21/9] max-h-[400px] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Badge variant="secondary" className="mb-4">{article.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {article.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {article.readTime}
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            OTHERS Team
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          {article.content.map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            return (
              <p key={index} className="text-muted-foreground mb-4 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Find Your Connection?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join OTHERS today and start building meaningful relationships.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg" className="bg-gradient-to-r from-primary to-accent">
            Join Free Today
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} OTHERS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogArticle;
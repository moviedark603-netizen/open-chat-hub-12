 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Heart, Users, Shield, MessageSquare, Star, CheckCircle } from "lucide-react";
 
 const TamilContent = () => {
   const tamilTips = [
     {
       icon: Heart,
       title: "நேர்மையாக இருங்கள்",
       description: "உங்கள் சுயவிவரத்தில் உண்மையான தகவல்களை மட்டுமே பகிருங்கள். போலியான தகவல்கள் நல்ல உறவுக்கு அடிப்படையாக இருக்காது."
     },
     {
       icon: Users,
       title: "மரியாதையாக பேசுங்கள்",
       description: "எல்லோரையும் மரியாதையுடன் நடத்துங்கள். நல்ல தொடர்பாடல் வெற்றிகரமான உறவின் அடிப்படை."
     },
     {
       icon: Shield,
       title: "பாதுகாப்பாக இருங்கள்",
       description: "முதல் சந்திப்பை பொது இடத்தில் வைக்கவும். உங்கள் தனிப்பட்ட தகவல்களை பாதுகாக்கவும்."
     },
     {
       icon: MessageSquare,
       title: "தொடர்புடன் இருங்கள்",
       description: "தொடர்ந்து செய்திகள் அனுப்புங்கள். நல்ல தொடர்பாடல் உறவை வலுப்படுத்தும்."
     }
   ];
 
   const successStories = [
     {
       name: "கார்த்திக் & ப்ரியா",
       location: "சென்னை",
       story: "நாங்கள் OTHERS-ல் சந்தித்தோம். ஒரு வருடம் டேட்டிங் செய்த பின், இப்போது திருமணமானோம்!",
       rating: 5
     },
     {
       name: "அருண் & மீனா",
       location: "கோயம்புத்தூர்",
       story: "இலவசமாக இந்த தளத்தில் என் வாழ்க்கைத் துணையை கண்டுபிடித்தேன். நன்றி OTHERS!",
       rating: 5
     },
     {
       name: "சுரேஷ் & லட்சுமி",
       location: "மதுரை",
       story: "பாதுகாப்பான தளம், உண்மையான மக்கள். OTHERS சிறந்த இலவச டேட்டிங் தளம்!",
       rating: 5
     }
   ];
 
   return (
     <div className="space-y-12">
       {/* Tamil Dating Tips */}
       <section>
         <div className="text-center mb-8">
           <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
             டேட்டிங் குறிப்புகள்
           </Badge>
           <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
             வெற்றிகரமான டேட்டிங்கிற்கான குறிப்புகள்
           </h2>
           <p className="text-muted-foreground">Tips for Successful Dating</p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {tamilTips.map((tip, index) => {
             const Icon = tip.icon;
             return (
               <Card key={index} className="border-border bg-card magnetic-hover">
                 <CardContent className="p-5 text-center">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                     <Icon className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="text-base font-semibold text-foreground mb-2">{tip.title}</h3>
                   <p className="text-muted-foreground text-sm">{tip.description}</p>
                 </CardContent>
               </Card>
             );
           })}
         </div>
       </section>
 
       {/* Tamil Success Stories */}
       <section>
         <div className="text-center mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
             வெற்றிக் கதைகள்
           </Badge>
           <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
             தமிழ் காதல் கதைகள்
           </h2>
           <p className="text-muted-foreground">Tamil Love Stories from OTHERS</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {successStories.map((story, index) => (
             <Card key={index} className="border-border bg-card glass-animated">
               <CardContent className="p-6">
                 <div className="flex items-center gap-1 mb-4">
                   {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                   ))}
                 </div>
                 <p className="text-foreground mb-4 italic">"{story.story}"</p>
                 <div className="flex items-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                     <Heart className="w-5 h-5 text-primary fill-primary" />
                   </div>
                   <div>
                     <div className="font-semibold text-foreground text-sm">{story.name}</div>
                     <div className="text-xs text-muted-foreground">{story.location}</div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </section>
 
       {/* Detailed Tamil Content for SEO */}
       <section className="bg-muted/30 -mx-4 px-4 py-8 md:py-12 rounded-lg">
         <div className="max-w-4xl mx-auto">
           <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
             தமிழில் இலவச ஆன்லைன் டேட்டிங் | Free Online Dating in Tamil
           </h2>
           
           <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
             <Card className="bg-card">
               <CardContent className="p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-3">
                   ஏன் ஆன்லைன் டேட்டிங்?
                 </h3>
                 <p className="leading-relaxed mb-4">
                   இன்றைய பிஸியான உலகில், புதிய மக்களை சந்திப்பது கடினமாக இருக்கலாம். வேலை, 
                   படிப்பு, மற்றும் பிற பொறுப்புகளுக்கு இடையே நேரம் கிடைப்பது அரிது. ஆன்லைன் 
                   டேட்டிங் இந்த பிரச்சனைக்கு தீர்வாக அமைகிறது.
                 </p>
                 <p className="leading-relaxed">
                   OTHERS போன்ற தளங்கள் மூலம் நீங்கள் உங்கள் வீட்டில் இருந்தே உங்கள் பகுதியில் 
                   உள்ள சிங்கிள்களை சந்திக்கலாம். உங்கள் விருப்பங்களுக்கு ஏற்ற நபரை தேடி 
                   கண்டுபிடிக்கலாம். இது நேரத்தையும் முயற்சியையும் மிச்சப்படுத்துகிறது.
                 </p>
               </CardContent>
             </Card>
 
             <Card className="bg-card">
               <CardContent className="p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-3">
                   தமிழ்நாட்டில் டேட்டிங் கலாச்சாரம்
                 </h3>
                 <p className="leading-relaxed mb-4">
                   தமிழ்நாட்டில் டேட்டிங் கலாச்சாரம் வேகமாக மாறி வருகிறது. இளைய தலைமுறை 
                   பாரம்பரிய மதிப்புகளை மதித்துக்கொண்டே நவீன வழிகளில் உறவுகளை உருவாக்க 
                   விரும்புகிறார்கள்.
                 </p>
                 <ul className="list-disc list-inside space-y-2 mb-4">
                   <li>சென்னை, கோயம்புத்தூர் போன்ற நகரங்களில் ஆன்லைன் டேட்டிங் பிரபலமாகி வருகிறது</li>
                   <li>இளைஞர்கள் தங்கள் துணையை தாங்களே தேர்ந்தெடுக்க விரும்புகிறார்கள்</li>
                   <li>குடும்பத்தின் ஒப்புதலும் முக்கியமானதாக கருதப்படுகிறது</li>
                   <li>கல்வி மற்றும் தொழில் வளர்ச்சிக்கு பின் திருமணம் என்ற போக்கு அதிகரித்து வருகிறது</li>
                 </ul>
                 <p className="leading-relaxed">
                   OTHERS தளம் இந்த மாற்றத்தை ஏற்று, பாதுகாப்பான மற்றும் இலவசமான 
                   டேட்டிங் அனுபவத்தை வழங்குகிறது.
                 </p>
               </CardContent>
             </Card>
 
             <Card className="bg-card">
               <CardContent className="p-6">
                 <h3 className="text-lg font-semibold text-foreground mb-3">
                   ஆன்லைன் டேட்டிங்கில் வெற்றி பெறுவது எப்படி?
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex items-start gap-2">
                     <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                     <div>
                       <strong className="text-foreground">நல்ல புகைப்படங்கள்</strong>
                       <p className="text-sm">தெளிவான, சமீபத்திய புகைப்படங்களை பயன்படுத்துங்கள்</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-2">
                     <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                     <div>
                       <strong className="text-foreground">சுவாரஸ்யமான சுயவிவரம்</strong>
                       <p className="text-sm">உங்கள் ஆளுமையை வெளிப்படுத்தும் விவரணை எழுதுங்கள்</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-2">
                     <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                     <div>
                       <strong className="text-foreground">செயலில் இருங்கள்</strong>
                       <p className="text-sm">தொடர்ந்து உள்நுழைந்து செய்திகளுக்கு பதிலளியுங்கள்</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-2">
                     <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                     <div>
                       <strong className="text-foreground">பொறுமையாக இருங்கள்</strong>
                       <p className="text-sm">சரியான நபரை கண்டுபிடிக்க நேரம் ஆகலாம்</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>
     </div>
   );
 };
 
 export default TamilContent;
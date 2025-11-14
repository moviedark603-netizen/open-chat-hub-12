import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using OTHERS dating platform, you agree to be bound by these Terms and Conditions. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              You must be at least 18 years old to use OTHERS. By using this service, you represent and warrant 
              that you are of legal age to form a binding contract.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You agree to 
              accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to use OTHERS to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Harass, abuse, or harm another person</li>
              <li>Post false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Upload inappropriate or offensive content</li>
              <li>Engage in any illegal activities</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">5. Content</h2>
            <p className="text-muted-foreground mb-4">
              You retain ownership of any content you post on OTHERS. However, by posting content, you grant us 
              a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">6. Safety</h2>
            <p className="text-muted-foreground mb-4">
              OTHERS does not conduct background checks on users. You are solely responsible for your interactions 
              with other users. Always exercise caution when meeting someone in person for the first time.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account at any time for any reason, including 
              violation of these terms.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              OTHERS shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              by posting the new Terms and Conditions on this page.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms and Conditions, please contact us through the app.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Disclaimer = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read this disclaimer carefully before using our service.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 space-y-8">
          {/* Important Notice */}
          <div className="bg-caution/10 border border-caution/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-caution flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Important Notice</h2>
                <p className="text-muted-foreground">
                  The information provided on PetSafeChoice is for general informational and educational purposes only. 
                  It is not intended to be a substitute for professional veterinary advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>

          {/* Not Medical Advice */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Not Veterinary Medical Advice</h2>
            <p className="text-muted-foreground mb-4">
              The content on this website, including but not limited to text, graphics, images, and other material, 
              is for informational purposes only. The content is not intended to be a substitute for professional 
              veterinary advice, diagnosis, or treatment. Always seek the advice of a qualified veterinarian with 
              any questions you may have regarding your pet's health or medical condition.
            </p>
            <p className="text-muted-foreground">
              Never disregard professional veterinary advice or delay in seeking it because of something you have 
              read on this website. If you think your pet may have a medical emergency, call your veterinarian or 
              emergency veterinary clinic immediately.
            </p>
          </section>

          {/* Accuracy of Information */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Accuracy of Information</h2>
            <p className="text-muted-foreground mb-4">
              While we strive to provide accurate and up-to-date information about pet food safety, we make no 
              representations or warranties of any kind, express or implied, about the completeness, accuracy, 
              reliability, suitability, or availability of the information contained on this website.
            </p>
            <p className="text-muted-foreground">
              Our information is derived from AI-powered analysis of veterinary research and scientific literature. 
              However, pet nutrition is a complex field, and individual pets may have unique dietary needs, allergies, 
              or health conditions that require specialized veterinary guidance.
            </p>
          </section>

          {/* AI-Generated Content */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">AI-Generated Content</h2>
            <p className="text-muted-foreground">
              This website uses artificial intelligence to provide food safety information. While our AI is trained 
              on veterinary research and expert recommendations, AI-generated content may contain errors or omissions. 
              The AI's recommendations should be verified with a qualified veterinarian, especially for pets with 
              health conditions, allergies, or special dietary requirements.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              PetSafeChoice and its owners, operators, affiliates, and contributors shall not be liable for any 
              direct, indirect, incidental, consequential, or punitive damages arising out of your access to, 
              use of, or inability to use this website, or any errors or omissions in the content.
            </p>
            <p className="text-muted-foreground">
              By using this website, you acknowledge and agree that you do so at your own risk. We are not 
              responsible for any harm that may come to your pet as a result of following the information 
              provided on this website.
            </p>
          </section>

          {/* Emergency Situations */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Emergency Situations</h2>
            <p className="text-muted-foreground">
              If your pet has ingested a potentially harmful substance, do not rely solely on the information 
              provided on this website. Contact your veterinarian, an emergency animal hospital, or a pet poison 
              control hotline immediately. Time is critical in poisoning cases, and professional medical 
              intervention may be necessary to save your pet's life.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Links and Information</h2>
            <p className="text-muted-foreground">
              This website may contain links to third-party websites, including veterinary clinics and emergency 
              services. These links are provided for your convenience only. We do not endorse, guarantee, or make 
              any representations about the accuracy, relevance, timeliness, or completeness of any information 
              on these third-party websites. We are not responsible for the content, products, or services 
              offered by third parties.
            </p>
          </section>

          {/* Changes to Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Disclaimer</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify this disclaimer at any time without prior notice. Your continued use 
              of this website after any changes indicates your acceptance of the modified disclaimer.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this disclaimer, please contact us at{" "}
              <a href="mailto:Hello@petsafechoice.com" className="text-primary hover:underline">
                Hello@petsafechoice.com
              </a>
            </p>
          </section>

          {/* Last Updated */}
          <p className="text-sm text-muted-foreground text-center pt-4 border-t border-border">
            Last updated: January 2026
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Brain, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            About Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're dedicated to keeping your furry friends safe and healthy by providing accurate, science-backed food safety information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower pet owners with reliable, easy-to-understand information about what foods are safe for their pets. We believe every pet deserves a healthy diet, and every owner deserves peace of mind.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Science-Backed</h3>
            <p className="text-muted-foreground">
              Our food safety information is powered by AI trained on veterinary research, peer-reviewed studies, and expert recommendations from animal nutrition specialists.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Built with Love</h3>
            <p className="text-muted-foreground">
              Created by pet lovers, for pet lovers. We understand the special bond between you and your furry companions, and we're here to help you keep them happy and healthy.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              We continuously improve our platform based on feedback from pet owners and veterinary professionals. Your input helps us serve the pet community better.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Important Disclaimer</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            While we strive to provide accurate and up-to-date information, our tool should not replace professional veterinary advice. If your pet has consumed something potentially harmful, please contact your veterinarian or an emergency animal poison control center immediately.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

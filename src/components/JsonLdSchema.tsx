import { useEffect } from "react";
import { SafetyResultData } from "./SafetyResult";

interface JsonLdSchemaProps {
  result: SafetyResultData | null;
}

export function JsonLdSchema({ result }: JsonLdSchemaProps) {
  useEffect(() => {
    // Remove any existing JSON-LD scripts we added
    const existingScripts = document.querySelectorAll('script[data-schema="petsafechoice"]');
    existingScripts.forEach(script => script.remove());

    if (!result) {
      // Add default WebSite schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PetSafeChoice",
        "url": window.location.origin,
        "description": "Science-backed food safety information for dogs and cats. Know what's safe before you share!",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${window.location.origin}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'petsafechoice');
      script.textContent = JSON.stringify(websiteSchema);
      document.head.appendChild(script);
      return;
    }

    const petName = result.petType === "dog" ? "dogs" : "cats";
    const petNameSingular = result.petType === "dog" ? "dog" : "cat";
    const foodName = result.food.charAt(0).toUpperCase() + result.food.slice(1);
    const currentUrl = window.location.href;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Detect liquid foods for eat/drink grammar
    const liquidFoods = new Set(["water", "milk", "broth", "juice", "kefir", "tea", "coffee"]);
    const isLiquid = liquidFoods.has(result.food.toLowerCase().trim());
    const eatDrink = isLiquid ? "drink" : "eat";

    // Build answer based on safety level with correct eat/drink verb
    let quickAnswer = "";
    switch (result.safetyLevel) {
      case "safe":
        quickAnswer = `Yes, ${petName} can safely ${eatDrink} ${foodName.toLowerCase()}. ${result.summary}`;
        break;
      case "caution":
        quickAnswer = `${foodName} should be given to ${petName} with caution. ${result.summary}`;
        break;
      case "dangerous":
        quickAnswer = `No, ${foodName} is toxic to ${petName} and should never be given to them. ${result.summary}`;
        break;
    }

    // FAQ Schema - Great for featured snippets with dynamic eat/drink verb
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Can ${petName} ${eatDrink} ${foodName.toLowerCase()}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": quickAnswer
          }
        },
        {
          "@type": "Question",
          "name": `Is ${foodName.toLowerCase()} safe for ${petName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": quickAnswer
          }
        },
        ...(result.symptoms && result.symptoms.length > 0 ? [{
          "@type": "Question",
          "name": `What are the symptoms if my ${petNameSingular} ${isLiquid ? "drinks" : "eats"} ${foodName.toLowerCase()}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Symptoms to watch for include: ${result.symptoms.join(', ')}. ${result.details}`
          }
        }] : [])
      ]
    };

    // Article Schema for authority
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Can ${petName.charAt(0).toUpperCase() + petName.slice(1)} Eat ${foodName}? Safety Guide`,
      "description": result.summary,
      "author": {
        "@type": "Organization",
        "name": "PetSafeChoice",
        "url": window.location.origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "PetSafeChoice",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/favicon.ico`
        }
      },
      "datePublished": currentDate,
      "dateModified": currentDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      }
    };

    // Speakable Schema for voice search optimization
    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Can ${petName} eat ${foodName.toLowerCase()}?`,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".featured-snippet-answer", ".safety-summary"]
      },
      "url": currentUrl
    };

    // VeterinaryMedical entity for E-E-A-T signals
    const medicalSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "about": {
        "@type": "MedicalCondition",
        "name": `${foodName} consumption in ${petName}`,
        "possibleTreatment": result.recommendations?.join('. ') || "Consult a veterinarian"
      },
      "lastReviewed": "2026-01-24",
      "dateModified": "2026-01-24",
      "reviewedBy": {
        "@type": "Organization",
        "name": "PetSafeChoice Veterinary Advisory Board",
        "url": `${window.location.origin}/about`
      },
      "medicalAudience": {
        "@type": "MedicalAudience",
        "audienceType": "Pet Owners"
      }
    };

    // Combine all schemas
    const combinedSchema = [faqSchema, articleSchema, speakableSchema, medicalSchema];

    // Add all schemas
    combinedSchema.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'petsafechoice');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-schema="petsafechoice"]');
      scripts.forEach(script => script.remove());
    };
  }, [result]);

  return null; // This component only injects scripts
}

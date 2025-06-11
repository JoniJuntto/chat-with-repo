import React from "react";
import {
  ArrowLeft,
  Shield,
  Calendar,
  Mail,
  Eye,
  Lock,
  Database,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Last updated: June 2025
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Privacy & Security</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we collect, use, and protect your information
            </p>
          </div>

          {/* Quick Overview */}
          <Card className="mb-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                Privacy at a Glance
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Your data is encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>Minimal data collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>No data selling</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="mb-8">
                  <p className="text-lg leading-relaxed">
                    This Privacy Policy describes how{" "}
                    <strong>Makkara Chat</strong> (we, us, or our), an AI
                    assistant for understanding GitHub repositories, collects,
                    uses, and shares your information when you use our website
                    and services (the &quot;Service&quot;).
                  </p>
                </div>

                <Section
                  number="1"
                  title="Who We Are"
                  icon={<Users className="h-5 w-5" />}
                  content="We are Pöhinä Group, people behind the Makkara Chat, dedicated to helping you explore and understand GitHub repositories."
                />

                <Section
                  number="2"
                  title="Information We Collect"
                  icon={<Database className="h-5 w-5" />}
                  content={
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">
                          Information You Provide Directly:
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <strong>Account Information:</strong> When you sign
                            in using GitHub, we collect your GitHub User ID,
                            email address, and potentially your IP address. This
                            information is used to create and manage your
                            Makkara Chat account.
                          </li>
                          <li>
                            <strong>Chat Content:</strong> The questions you ask
                            about repositories and the AI-generated responses
                            are collected and stored as your chat history.
                          </li>
                          <li>
                            <strong>Repository Information:</strong> When you
                            specify a GitHub repository (e.g., owner/repo), this
                            information is collected.
                          </li>
                          <li>
                            <strong>Favorite Repositories:</strong> If you use
                            the &quot;favorite&quot; feature, we store the
                            GitHub repository URL, owner, and name associated
                            with your user ID.
                          </li>
                          <li>
                            <strong>Payment Information:</strong> If you
                            subscribe to a paid plan, we collect information
                            necessary to process your subscription, including
                            your user ID, and interact with our payment
                            processor (Stripe) to manage your subscription
                            status and IDs (e.g., Stripe Customer ID, Stripe
                            Subscription ID). We do not directly store your
                            credit card details.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">
                          Information Collected Automatically:
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <strong>Usage Data:</strong> We collect information
                            about how you interact with the Service, such as the
                            pages you visit, the features you use, and the time
                            and date of your interactions.
                          </li>
                          <li>
                            <strong>Rate Limit Data:</strong> We track your
                            message count and last reset time to enforce rate
                            limits.
                          </li>
                          <li>
                            <strong>Device and Connection Information:</strong>{" "}
                            We may collect information about the device and
                            network you use to access the Service, including IP
                            address, browser type, and operating system.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">
                          Information from Third Parties:
                        </h4>
                        <ul className="space-y-2">
                          <li>
                            <strong>GitHub:</strong> When you provide a
                            repository URL, we use the GitHub API to fetch
                            public information about that repository (e.g.,
                            name, description, language, stars, forks, URL,
                            owner details, topics, creation/update dates,
                            issues, visibility, default branch, size). This
                            information is used to provide context to the AI and
                            display repository details.
                          </li>
                          <li>
                            <strong>Stripe:</strong> Our payment processor,
                            Stripe, provides us with information regarding your
                            subscription status (e.g., active, deleted) and
                            associated IDs (e.g., customer ID, subscription ID)
                            to manage your access to premium features.
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                />

                <Section
                  number="3"
                  title="How We Use Your Information"
                  icon={<Eye className="h-5 w-5" />}
                  content={
                    <div>
                      <p className="mb-4">
                        We use the collected information for the following
                        purposes:
                      </p>
                      <ul className="space-y-2">
                        <li>
                          <strong>To Provide and Maintain the Service:</strong>
                          This includes enabling AI chat functionality, fetching
                          repository data, managing your account, and storing
                          your chat history and favorite repositories.
                        </li>
                        <li>
                          <strong>To Process Subscriptions:</strong> To manage
                          your paid subscriptions, enforce rate limits, and
                          provide access to premium features.
                        </li>
                        <li>
                          <strong>
                            To Improve and Personalize the Service:
                          </strong>
                          We analyze usage patterns to understand how our
                          Service is used, identify areas for improvement, and
                          enhance the user experience.
                        </li>
                        <li>
                          <strong>For Security and Fraud Prevention:</strong> To
                          protect the integrity and security of our Service and
                          to detect and prevent fraudulent activities.
                        </li>
                        <li>
                          <strong>To Communicate with You:</strong> To send you
                          service-related notifications, updates, or support
                          messages.
                        </li>
                        <li>
                          <strong>For Legal Compliance:</strong> To comply with
                          applicable laws, regulations, and legal processes.
                        </li>
                      </ul>
                    </div>
                  }
                />

                <Section
                  number="4"
                  title="How We Share Your Information"
                  icon={<Users className="h-5 w-5" />}
                  content={
                    <div>
                      <p className="mb-4">
                        We may share your information with the following
                        categories of third parties:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">
                            Service Providers:
                          </h4>
                          <p className="mb-2">
                            We engage third-party companies and individuals to
                            facilitate our Service, provide the Service on our
                            behalf, perform Service-related services, or assist
                            us in analyzing how our Service is used. These
                            include:
                          </p>
                          <ul className="space-y-1 ml-4">
                            <li>
                              <strong>GitHub:</strong> To retrieve public
                              repository information based on your input.
                            </li>
                            <li>
                              <strong>Google AI (Gemini):</strong> Your chat
                              messages (excluding your personal identity) are
                              sent to Google&quot;s AI models to generate
                              responses.
                            </li>
                            <li>
                              <strong>Stripe:</strong> For processing payments
                              and managing subscriptions.
                            </li>
                            <li>
                              <strong>Database Provider (Postgres):</strong> For
                              storing user data, chat history, and other
                              application data.
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">
                            Legal Requirements:
                          </h4>
                          <p>
                            We may disclose your information if required to do
                            so by law or in response to valid requests by public
                            authorities (e.g., a court order or government
                            agency).
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">
                            Business Transfers:
                          </h4>
                          <p>
                            In the event of a merger, acquisition, or asset
                            sale, your personal data may be transferred. We will
                            provide notice before your personal data is
                            transferred and becomes subject to a different
                            Privacy Policy.
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                />

                <Section
                  number="5"
                  title="Data Retention"
                  icon={<Database className="h-5 w-5" />}
                  content="We retain your personal information for as long as necessary to provide the Service, fulfill the purposes outlined in this Privacy Policy, or comply with our legal obligations. Chat history and favorite repository data are retained as long as your account is active, unless you request deletion."
                />

                <Section
                  number="6"
                  title="Data Security"
                  icon={<Lock className="h-5 w-5" />}
                  content="We implement reasonable technical and organizational measures designed to protect your personal information from unauthorized access, use, alteration, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure."
                />

                <Section
                  number="7"
                  title="Your Rights"
                  icon={<Shield className="h-5 w-5" />}
                  content={
                    <div>
                      <p className="mb-4">
                        Depending on your jurisdiction, you may have the
                        following rights regarding your personal data:
                      </p>
                      <ul className="space-y-2">
                        <li>
                          <strong>Access:</strong> Request a copy of the
                          personal data we hold about you.
                        </li>
                        <li>
                          <strong>Correction:</strong> Request that we correct
                          any inaccurate or incomplete personal data.
                        </li>
                        <li>
                          <strong>Deletion:</strong> Request that we delete your
                          personal data, subject to certain legal obligations.
                        </li>
                        <li>
                          <strong>Objection/Restriction:</strong> Object to or
                          request restriction of the processing of your personal
                          data.
                        </li>
                        <li>
                          <strong>Data Portability:</strong> Request to receive
                          your personal data in a structured, commonly used, and
                          machine-readable format.
                        </li>
                      </ul>
                      <p className="mt-4">
                        To exercise these rights, please contact us using the
                        information below.
                      </p>
                    </div>
                  }
                />

                <Section
                  number="8"
                  title="Children&quot;s Privacy"
                  icon={<Users className="h-5 w-5" />}
                  content="Our Service is not intended for use by individuals under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from a child under 13 without verification of parental consent, we take steps to remove that information from our servers."
                />

                <Section
                  number="9"
                  title="Changes to This Privacy Policy"
                  icon={<Calendar className="h-5 w-5" />}
                  content="We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
                />

                <Section
                  number="10"
                  title="Contact Us"
                  icon={<Mail className="h-5 w-5" />}
                  content="If you have any questions about this Privacy Policy, please contact us."
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Rights Card */}
          <Card className="mt-8 bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-8 text-center">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Exercise Your Data Rights
              </h3>
              <p className="text-muted-foreground mb-4">
                You have control over your personal data. Contact us to access,
                correct, or delete your information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="mailto:joni@pohina.group">Contact Support</Link>
                </Button>
                <Button asChild>
                  <Link href="/account/data">Manage Data</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode | string;
}

const Section: React.FC<SectionProps> = ({ number, title, icon, content }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">{number}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
      </div>
      <div className="ml-12 text-muted-foreground leading-relaxed">
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
      <Separator className="mt-6" />
    </div>
  );
};

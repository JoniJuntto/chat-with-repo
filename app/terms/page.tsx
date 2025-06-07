import React from "react";
import { ArrowLeft, FileText, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsOfService() {
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
              Last updated: December 2024
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using Makkara Chat
            </p>
          </div>

          {/* Main Content */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="mb-8">
                  <p className="text-lg leading-relaxed">
                    Welcome to <strong>Makkara Chat</strong>, an AI assistant
                    designed to help you understand and work with GitHub
                    repositories. These Terms of Service (&quot;Terms&quot;)
                    govern your access to and use of the Makkara Chat website
                    and services (collectively, the &quot;Service&quot;).
                  </p>
                </div>

                <Section
                  number="1"
                  title="Acceptance of Terms"
                  content="By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use the Service."
                />

                <Section
                  number="2"
                  title="Service Description"
                  content="Makkara Chat provides an AI-powered interface that allows you to interact with public GitHub repositories. The Service fetches repository information and file contents to enable an AI assistant to answer your questions about the codebase, architecture, and functionality."
                />

                <Section
                  number="3"
                  title="User Accounts"
                  content={
                    <ul className="space-y-2">
                      <li>
                        To access certain features, you may be required to
                        create an account, typically through GitHub
                        authentication.
                      </li>
                      <li>
                        You are responsible for maintaining the confidentiality
                        of your account credentials and for all activities that
                        occur under your account.
                      </li>
                      <li>
                        You agree to provide accurate, current, and complete
                        information during the registration process and to
                        update such information to keep it accurate, current,
                        and complete.
                      </li>
                    </ul>
                  }
                />

                <Section
                  number="4"
                  title="User Conduct"
                  content={
                    <div>
                      <p className="mb-4">
                        You agree not to use the Service for any unlawful or
                        prohibited purpose, including but not limited to:
                      </p>
                      <ul className="space-y-2">
                        <li>
                          Attempting to gain unauthorized access to the Service,
                          user accounts, or computer systems or networks
                          connected to the Service.
                        </li>
                        <li>
                          Using the Service to generate or disseminate harmful,
                          illegal, abusive, or inappropriate content.
                        </li>
                        <li>
                          Interfering with the proper functioning of the Service
                          or any activities conducted on the Service.
                        </li>
                        <li>
                          Misusing GitHub&APOS;s API or data accessed through
                          the Service in a manner that violates GitHub&APOS;s
                          terms of service.
                        </li>
                      </ul>
                    </div>
                  }
                />

                <Section
                  number="5"
                  title="Intellectual Property"
                  content={
                    <ul className="space-y-2">
                      <li>
                        The Service and its original content, features, and
                        functionality are and will remain the exclusive property
                        of Makkara Chat and its licensors.
                      </li>
                      <li>
                        You retain ownership of the content you submit to the
                        Service (e.g., your questions).
                      </li>
                      <li>
                        The AI-generated responses are provided for your use in
                        understanding repositories.
                      </li>
                    </ul>
                  }
                />

                <Section
                  number="6"
                  title="Privacy"
                  content="Your use of the Service is also governed by our Privacy Policy. We collect and store certain user data, chat history, and information related to your favorite repositories and subscriptions to provide and improve the Service."
                />

                <Section
                  number="7"
                  title="Rate Limits and Subscriptions"
                  content={
                    <ul className="space-y-2">
                      <li>
                        The Service implements rate limits for unauthenticated
                        and free users.
                      </li>
                      <li>
                        Access to additional messages and features may require a
                        paid subscription, processed via Stripe. All
                        subscription payments are subject to Stripe&APOS;s terms
                        and conditions.
                      </li>
                      <li>Subscription fees are generally non-refundable.</li>
                    </ul>
                  }
                />

                <Section
                  number="8"
                  title="Third-Party Services"
                  content={
                    <div>
                      <p className="mb-4">
                        The Service integrates with and relies on third-party
                        services, including but not limited to:
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li>
                          <strong>GitHub:</strong> For fetching repository data.
                        </li>
                        <li>
                          <strong>Google AI:</strong> For powering the AI
                          assistant&APOS;s responses.
                        </li>
                        <li>
                          <strong>Stripe:</strong> For payment processing and
                          subscription management.
                        </li>
                      </ul>
                      <p>
                        Your use of these third-party services is subject to
                        their respective terms and policies. Makkara Chat is not
                        responsible for the actions or omissions of these third
                        parties.
                      </p>
                    </div>
                  }
                />

                <Section
                  number="9"
                  title="Disclaimer of Warranties"
                  content="The Service is provided on an &APOS;as is&APOS; and &APOS;as available&APOS; basis, without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance. Makkara Chat does not warrant that the Service will be uninterrupted, secure, or error-free."
                />

                <Section
                  number="10"
                  title="Limitation of Liability"
                  content="To the fullest extent permitted by applicable law, in no event shall Makkara Chat, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Service; (b) any conduct or content of any third party on the Service; (c) any content obtained from the Service; and (d) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage."
                />

                <Section
                  number="11"
                  title="Termination"
                  content="We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Service will immediately cease."
                />

                <Section
                  number="12"
                  title="Changes to Terms"
                  content="We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&APOS; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms."
                />

                <Section
                  number="13"
                  title="Governing Law"
                  content="These Terms shall be governed and construed in accordance with the laws of Finland, without regard to its conflict of law provisions."
                />

                <Section
                  number="14"
                  title="Contact Us"
                  content="If you have any questions about these Terms, please contact us."
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8 bg-muted/50 border-border/50">
            <CardContent className="p-8 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Questions about these terms?
              </h3>
              <p className="text-muted-foreground mb-4">
                We&APOS;re here to help. Contact us if you need clarification on
                any of these terms.
              </p>
              <Button asChild>
                <Link href="mailto:joni@pohina.group">Contact Support</Link>
              </Button>
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
  content: React.ReactNode | string;
}

const Section: React.FC<SectionProps> = ({ number, title, content }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">{number}</span>
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="ml-12 text-muted-foreground leading-relaxed">
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
      <Separator className="mt-6" />
    </div>
  );
};

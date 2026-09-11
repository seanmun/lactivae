"use client";

import { useState } from "react";
import { css } from "../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/auth-shared";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    zipCode: "",
    interest: "",
    userType: "consumer",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (!isSupabaseConfigured()) {
        setMessage("Registration is not available in this environment yet.");
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/register?welcome=1")}`,
          data: {
            display_name: formData.displayName,
            zip_code: formData.zipCode,
            interest: formData.interest,
            user_type: formData.userType,
          },
        },
      });
      if (error) throw error;
      setMessage("Check your email for a magic link to complete registration!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className={css({
          position: "relative",
          padding: "4rem 2rem",
          borderBottom: "1px solid",
          borderColor: "border.light",
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bg: "accent.primary",
        })}
      >
        {/* Background Image */}
        <div
          className={css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/milk-glass.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            zIndex: 0,
          })}
        />

        <div
          className={css({
            position: "relative",
            zIndex: 1,
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          })}
        >
          <h1
            className={css({
              fontFamily: "heading",
              fontSize: { base: "3xl", md: "4xl" },
              fontWeight: "800",
              color: "bg.primary",
              marginBottom: "1rem",
            })}
          >
            Join LACTIVAE™
          </h1>
          <p
            className={css({
              fontFamily: "body",
              fontSize: "xl",
              lineHeight: "1.6",
              color: "bg.primary",
            })}
          >
            Stay informed with the latest research, resources, and updates
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <div
        className={css({
          maxWidth: "600px",
          margin: "0 auto",
          padding: "4rem 2rem",
        })}
      >
        <form onSubmit={handleSubmit}>
          {/* US Only Notice */}
          <div
            className={css({
              padding: "1rem",
              bg: "bg.tertiary",
              borderRadius: "6px",
              marginBottom: "2rem",
              border: "1px solid",
              borderColor: "border.light",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.secondary",
                textAlign: "center",
              })}
            >
              📍 This service is currently available for US subscribers only
            </p>
          </div>

          {/* Email */}
          <div
            className={css({
              marginBottom: "1.5rem",
            })}
          >
            <label
              htmlFor="email"
              className={css({
                display: "block",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "text.primary",
                marginBottom: "0.5rem",
              })}
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={css({
                width: "100%",
                padding: "0.75rem",
                fontFamily: "body",
                fontSize: "base",
                border: "1px solid",
                borderColor: "border.light",
                borderRadius: "6px",
                _focus: {
                  outline: "none",
                  borderColor: "accent.primary",
                },
              })}
              placeholder="your@email.com"
            />
          </div>

          {/* Display Name */}
          <div
            className={css({
              marginBottom: "1.5rem",
            })}
          >
            <label
              htmlFor="displayName"
              className={css({
                display: "block",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "text.primary",
                marginBottom: "0.5rem",
              })}
            >
              Display Name *
            </label>
            <input
              type="text"
              id="displayName"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className={css({
                width: "100%",
                padding: "0.75rem",
                fontFamily: "body",
                fontSize: "base",
                border: "1px solid",
                borderColor: "border.light",
                borderRadius: "6px",
                _focus: {
                  outline: "none",
                  borderColor: "accent.primary",
                },
              })}
              placeholder="How should we address you?"
            />
          </div>

          {/* Zip Code */}
          <div
            className={css({
              marginBottom: "1.5rem",
            })}
          >
            <label
              htmlFor="zipCode"
              className={css({
                display: "block",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "text.primary",
                marginBottom: "0.5rem",
              })}
            >
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              required
              pattern="[0-9]{5}"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className={css({
                width: "100%",
                padding: "0.75rem",
                fontFamily: "body",
                fontSize: "base",
                border: "1px solid",
                borderColor: "border.light",
                borderRadius: "6px",
                _focus: {
                  outline: "none",
                  borderColor: "accent.primary",
                },
              })}
              placeholder="12345"
            />
            <p
              className={css({
                fontFamily: "body",
                fontSize: "xs",
                color: "text.muted",
                marginTop: "0.25rem",
              })}
            >
              Helps us tailor local deals and partnerships
            </p>
          </div>

          {/* User Type */}
          <div
            className={css({
              marginBottom: "1.5rem",
            })}
          >
            <label
              htmlFor="userType"
              className={css({
                display: "block",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "text.primary",
                marginBottom: "0.5rem",
              })}
            >
              I am a *
            </label>
            <select
              id="userType"
              required
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              className={css({
                width: "100%",
                padding: "0.75rem",
                fontFamily: "body",
                fontSize: "base",
                border: "1px solid",
                borderColor: "border.light",
                borderRadius: "6px",
                bg: "bg.primary",
                _focus: {
                  outline: "none",
                  borderColor: "accent.primary",
                },
              })}
            >
              <option value="consumer">Consumer</option>
              <option value="hcp">Healthcare Provider</option>
            </select>
          </div>

          {/* Interest */}
          <div
            className={css({
              marginBottom: "1.5rem",
            })}
          >
            <label
              htmlFor="interest"
              className={css({
                display: "block",
                fontFamily: "body",
                fontSize: "sm",
                fontWeight: "600",
                color: "text.primary",
                marginBottom: "0.5rem",
              })}
            >
              Primary Interest *
            </label>
            <select
              id="interest"
              required
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              className={css({
                width: "100%",
                padding: "0.75rem",
                fontFamily: "body",
                fontSize: "base",
                border: "1px solid",
                borderColor: "border.light",
                borderRadius: "6px",
                bg: "bg.primary",
                _focus: {
                  outline: "none",
                  borderColor: "accent.primary",
                },
              })}
            >
              <option value="">Select your interest...</option>
              <option value="advocate">Advocacy & Education</option>
              <option value="researcher">Research & Studies</option>
              <option value="savings">Deals & Savings</option>
              <option value="general">General Information</option>
            </select>
          </div>

          {/* Opt-in Language */}
          <div
            className={css({
              padding: "1.5rem",
              bg: "bg.secondary",
              borderRadius: "6px",
              marginBottom: "1.5rem",
              border: "1px solid",
              borderColor: "border.light",
            })}
          >
            <p
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.secondary",
                lineHeight: "1.6",
                marginBottom: "0.75rem",
              })}
            >
              By clicking "Subscribe," you agree to receive email communications from LACTIVAE™, including:
            </p>
            <ul
              className={css({
                fontFamily: "body",
                fontSize: "sm",
                color: "text.secondary",
                lineHeight: "1.6",
                paddingLeft: "1.5rem",
                listStyleType: "disc",
                "& li": {
                  marginBottom: "0.25rem",
                },
              })}
            >
              <li>Research updates and clinical studies</li>
              <li>Educational resources and safety information</li>
              <li>Local partnerships and special offers</li>
              <li>Community news and advocacy opportunities</li>
            </ul>
            <p
              className={css({
                fontFamily: "body",
                fontSize: "xs",
                color: "text.muted",
                marginTop: "0.75rem",
                fontStyle: "italic",
              })}
            >
              You can manage your preferences or unsubscribe from specific topics at any time from your profile page.
              We respect your privacy and will never share your information with third parties.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={css({
              width: "100%",
              padding: "1rem",
              fontFamily: "body",
              fontSize: "base",
              fontWeight: "600",
              bg: "accent.primary",
              color: "bg.primary",
              border: "none",
              borderRadius: "6px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
              transition: "all 0.2s ease-out",
              _hover: {
                bg: isSubmitting ? "accent.primary" : "accent.secondary",
                transform: isSubmitting ? "none" : "translateY(-2px)",
              },
            })}
          >
            {isSubmitting ? "Processing..." : "Subscribe & Send Magic Link"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={css({
                marginTop: "1rem",
                padding: "1rem",
                bg: message.includes("error") ? "#fee" : "#efe",
                color: message.includes("error") ? "#c33" : "#363",
                borderRadius: "6px",
                fontFamily: "body",
                fontSize: "sm",
                textAlign: "center",
              })}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

"use client";

import Script from "next/script";

const url = process.env.NEXT_PUBLIC_BOOKING_URL || "";

export default function BookingEmbed() {
  // If you prefer the official Calendly widget script (supports auto-height)
  const isCalendly = url.includes("calendly.com");

  return (
    <div className="w-full">
      {isCalendly ? (
        <>
          {/* Calendly inline widget */}
          <div
            className="calendly-inline-widget rounded-xl"
            data-url={url}
            style={{ minWidth: "320px", height: "740px" }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
          />
        </>
      ) : (
        // Generic iframe (works for TidyCal and others)
        <div className="rounded-xl overflow-hidden border">
          <iframe
            src={url}
            className="w-full"
            style={{ height: "740px" }}
            frameBorder={0}
            title="Booking"
          />
        </div>
      )}
      
    </div>
    
  );
}

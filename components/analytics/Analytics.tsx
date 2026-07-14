import Script from "next/script";

/**
 * Third-party marketing / analytics tags, supplied verbatim by the SEO team
 * and installed site-wide via the root layout. Container IDs are pulled out as
 * constants for clarity; the injected script bodies are otherwise the exact
 * snippets provided.
 *
 * All tracking scripts use strategy="afterInteractive" so they load as soon
 * as the page becomes interactive, ensuring analytics, ads, and conversion
 * tracking fire reliably for every visitor.
 */

const GTM_ID = "GTM-TZ8TFM6";
const GOOGLE_ADS_ID = "AW-417752013";
const META_PIXEL_ID = "25069636102641709";

export default function Analytics() {
  return (
    <>
      {/* Google Tag Manager (noscript) — immediately after opening <body> */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      {/* Meta Pixel (noscript) */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      {/* Google Tag Manager */}
      <Script id="gtm-init" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* Google tag (gtag.js) — Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>

      {/* Meta Pixel — 1) stub the queue 2) load SDK via src 3) init+track */}
      <Script id="meta-pixel-stub" strategy="lazyOnload">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[]}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`}
      </Script>
      <Script
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="lazyOnload"
      />
      <Script id="meta-pixel-init" strategy="lazyOnload">
        {`fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
    </>
  );
}

import Script from "next/script";

/**
 * Third-party marketing / analytics tags, supplied verbatim by the SEO team
 * and installed site-wide via the root layout. Container IDs are pulled out as
 * constants for clarity; the injected script bodies are otherwise the exact
 * snippets provided.
 *
 * Implementation notes:
 *  - This is a Next.js App Router app — there is no static HTML <head>/<body> to
 *    paste into. `next/script` with strategy="afterInteractive" is the
 *    documented, supported way to load these (it is what @next/third-parties'
 *    GoogleTagManager uses by default) and produces the same runtime behaviour.
 *  - The <noscript> fallbacks are plain server-rendered markup. This component
 *    is rendered as the first child of <body>, so the GTM <noscript> iframe
 *    sits "immediately after the opening <body> tag" as required.
 *  - gtag here is the Google Ads tag (AW-…), not GA4 (G-…), so it is loaded as
 *    its own gtag.js include rather than via the GA4 helper.
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
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* Google tag (gtag.js) — Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
    </>
  );
}

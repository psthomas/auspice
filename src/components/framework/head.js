import React from 'react';
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { hasExtension, getExtension } from "../../util/extensions";
import nextstrainLogo from "../../images/nextstrain-logo-small.png";

const Head = ({metadata, general}) => {
  const lang = general.language;

  i18n
  .use(initReactI18next)
  .init({
    resources: require("i18next-resource-store-loader!../../locales/index.js"), // eslint-disable-line
    lng: lang,
    fallbackLng: "en",
    /* To debug any errors w.r.t. i18n, swith the second `false` to `true`
    (and this can be kept even after deployment if needed) */
    debug: process.env.NODE_ENV === 'production' ? false : false, // eslint-disable-line
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'translation'
  });

  let url = `${window.location.origin}${window.location.pathname}`;

  let pageTitle = "auspice";
  if (hasExtension("browserTitle")) {
    pageTitle = getExtension("browserTitle");
  }

  let socialImagePath = nextstrainLogo;
  if (hasExtension("socialComponent")) {
    const getSocialImage = getExtension("socialComponent");
    socialImagePath = getSocialImage(window.location.pathname);
  }
  let socialImageUrl = `${window.location.origin}${socialImagePath}`;

  const displayedDataset = window.location.pathname
    .replace(/^\//g, '')
    .replace(/\/$/g, '')
    .replace(/\//g, ' / ')
    .replace(/:/g, ' : ');
  if (displayedDataset) {
    pageTitle = pageTitle + " / " + displayedDataset;
  }
  return (
    <Helmet>
      <title>
        {pageTitle}
      </title>

      {/* General tags */}
      {metadata && metadata.title ?
        <meta name="description" content={metadata.title} /> :
        null}
      <meta name="image" content={socialImageUrl} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      {metadata && metadata.title ?
        <meta property="og:description" content={metadata.title} /> :
        null}
      <meta property="og:image" content={socialImageUrl} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      {metadata && metadata.title ?
        <meta name="twitter:description" content={metadata.title} /> :
        null}
      <meta name="twitter:image" content={socialImageUrl} />
    </Helmet>
  );
};

/* we want this component to rerun each time the pathname changes, which we keep a copy
of in state. This allows us to detect changes such as redirects such as /flu/avian ->
/flu/avian/h5n1/ha. Similarly when the metadata changes. */
export default connect(
  (state) => ({
    pathname: state.general.pathname,
    metadata: state.metadata,
    general: state.general
  })
)(Head);

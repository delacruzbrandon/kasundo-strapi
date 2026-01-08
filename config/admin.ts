const getPreviewPathname = (uid, { locale, document }): string => {
  const { slug } = document;
  
  // Handle different content types with their specific URL patterns
  switch (uid) {
    // Handle pages with predefined routes
    // Handle Event articles
    case "api::event.event": {
      if (!slug) {
        return `/events`; // Blog listing page
      }
      return `/events/${slug}`; // Individual article page
    }
    default: {
      return null;
    }
  }
};

export default ({ env }) => {
  const clientUrl = env("CLIENT_URL"); // Frontend application URL
  const previewSecret = env("PREVIEW_SECRET"); // Secret key for preview authentication
  return {

    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler (uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });
            
            // Generate the preview pathname based on content type and document
            const pathname = getPreviewPathname(uid, { locale, document });
  
            // Disable preview if the pathname is not found
            if (!pathname) {
              return null;
            }
  
            // Use Next.js draft mode passing it a secret key and the content-type status
            const urlSearchParams = new URLSearchParams({
              url: pathname,
              secret: previewSecret,
              status,
            });
            return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
  }
};

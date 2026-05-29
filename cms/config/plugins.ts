export default ({ env }: { env: any }) => {
  const useS3 = env('AWS_ACCESS_KEY_ID') && env('AWS_BUCKET') && env('AWS_REGION');

  return {
    seo: {
      enabled: true,
    },
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 2587,
          secure: false,
          auth: {
            user: env('SES_SMTP_USER'),
            pass: env('SES_SMTP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom: 'no-reply@vigotskyreynosa.edu.mx',
          defaultReplyTo: 'castrostech@gmail.com',
        },
      },
    },
    ...(useS3 && {
      upload: {
        config: {
          provider: 'aws-s3',
          providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
            region: env('AWS_REGION'),
            params: {
              ACL: env('AWS_ACL', 'private'),
              signedUrlExpires: env.int('AWS_SIGNED_URL_EXPIRES', 15 * 60),
              Bucket: env('AWS_BUCKET'),
            },
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
    }),
  };
};

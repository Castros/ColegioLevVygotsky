// Allow any host so the admin panel works behind a reverse proxy (staging/prod)
export default (config: any) => ({
  ...config,
  server: {
    ...(config.server || {}),
    allowedHosts: 'all',
  },
});

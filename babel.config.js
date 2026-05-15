module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'transform-inline-environment-variables',
        {
          // CLAUDE.md 규칙: process.env.GOOGLE_MAPS_API_KEY 로만 참조
          // 빌드 시점에 .env → process.env 값을 그대로 inlining
          include: ['GOOGLE_MAPS_API_KEY'],
        },
      ],
    ],
  };
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
<<<<<<< HEAD
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
=======
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
>>>>>>> anne-signup
    ],
  };
};

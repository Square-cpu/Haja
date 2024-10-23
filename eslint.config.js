/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential", // Regras essenciais para Vue 3
    "eslint:recommended", // Regras recomendadas do ESLint
    "@vue/eslint-config-prettier/skip-formatting", // Integração com Prettier para evitar conflitos
  ],
  parserOptions: {
    ecmaVersion: "latest", // Suporte à sintaxe JavaScript moderna
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", // Permite diferentes estilos de fim de linha
        semi: true, // Garante ponto e vírgula ao final das linhas
        singleQuote: false, // Usa aspas duplas
      },
    ],
    quotes: ["error", "double"], // Enforce o uso de aspas duplas
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Apenas warning para variáveis não usadas
  },
};

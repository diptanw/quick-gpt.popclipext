// #popclip
// name: QuickGPT
// icon: iconify:logos:openai-icon
// language: javascript
// module: true
// entitlements: [network]
// macos version: '14.0'
// requirements: [text, paste]
// excluded apps: [com.apple.Terminal]
// options: [{
//   identifier: apikey,
//   label: API Key,
//   type: string,
//   description: "Generate an API key at https://platform.openai.com/account/api-keys"
// },{
//   identifier: model,
//   label: Model,
//   type: multiple,
//   defaultValue: "gpt-4o",
//   description: "Specify the OpenAI model to use",
//   values: [gpt-4o, gpt-4-turbo, gpt-4, gpt-4o-mini]
// }]


"use strict";

const axios = require("axios");

async function callOpenAI(input, promptText, options) {
  const openai = axios.create({
    baseURL: "https://api.openai.com/v1/",
    headers: { Authorization: `Bearer ${options.apikey}` },
  });

  const content = `${promptText}${input.text.trim()}`;
  const messages = [{ role: "user", content }];

  const { data } = await openai.post("chat/completions", {
    model: options.model || "gpt-3.5-turbo",
    messages,
  });

  const response = data.choices[0].message.content.trim();

  if (popclip.modifiers.command) {
    popclip.showText(response, {preview: true});
  } else {
    popclip.pasteText(response, {restore: true});
    popclip.showSuccess();
  }

  return null;
}

exports.actions = [
  {
    title: "Check grammar",
    code: async (i, o) => await callOpenAI(i, "Correct the grammar, do not provide any comments, notes or errors: \n\n", o),
    icon: "symbol:checkmark.seal",
  },
  {
    title: "Professional tone",
    code:  async (i, o) => await callOpenAI(i, "Correct the grammar, and polish sentense: \n\n", o),
    icon: "symbol:brain.filled.head.profile",
  },
  {
    title: "Friendly tone",
    code: async (i, o) => await callOpenAI(i, "Rewrite this using a friendly tone: \n\n", o),
    icon: "symbol:face.smiling",
  },
  {
    title: "Refactor Code",
    requiredApps: ["com.microsoft.VSCode", "com.jetbrains.goland"],
    code: async (i, o) => await callOpenAI(i, "Refactor the following code, and provide only code, do not explain it: \n\n", o),
    icon: "symbol:apple.terminal",
  }
];
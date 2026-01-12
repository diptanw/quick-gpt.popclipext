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
//   identifier: baseUrl,
//   label: Base URL,
//   type: string,
//   defaultValue: "https://api.openai.com/v1/",
//   description: "OpenAI compatible API provider"
// },{
//   identifier: model,
//   label: Model,
//   type: string,
//   defaultValue: "gpt-4.1-nano",
//   description: "Specify the LLM to use"
// },{
//   identifier: apikey,
//   label: API Key,
//   type: secret
// },{
//   identifier: customPrompt,
//   label: Custom Prompt,
//   type: string,
//   defaultValue: "Format the text, or a code block, based on the content, don't add markdown tags",
//   description: "Custom prompt to use with the selected text"
// }]


"use strict";

const axios = require("axios");

async function callOpenAI(input, promptText, options) {
  const openai = axios.create({
    baseURL: options.baseUrl || "https://api.openai.com/v1/",
    headers: { Authorization: `Bearer ${options.apikey}` },
  });

  const content = `${promptText}${input.text.trim()}`;
  const messages = [{ role: "user", content }];

  const { data } = await openai.post("chat/completions", {
    model: options.model || "gpt-4.1-nano",
    messages,
  });

  const response = data.choices[0].message.content.trim();

  if (popclip.modifiers.command) {
    popclip.showText(response, {preview: true});
  } else {
    popclip.pasteText(response, {restore: true}); popclip.showSuccess();
  }

  return null;
}

exports.actions = [
  {
    title: "Check grammar",
    code: async (i, o) => await callOpenAI(i, "[Instruction] Return only the grammar-corrected text without any explanations, notes, or additional content, [end of instruction]: \n\n", o),
    icon: "symbol:checkmark.seal",
  },
  {
    title: "Custom prompt",
    code: async (i, o) => await callOpenAI(i, `[Instruction] ${o.customPrompt }. Return only result text without any explanations, notes, or comments, [end of instruction]: \n\n`, o),
    icon: "symbol:wand.and.stars",
  }
];
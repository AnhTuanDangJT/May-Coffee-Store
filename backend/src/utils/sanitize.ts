import sanitizeHtml from "sanitize-html";

const plainTextOptions: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  allowedSchemes: [],
  allowedSchemesByTag: {},
  parser: {
    decodeEntities: true,
  },
};

export const sanitizeText = (value: string): string => {
  if (!value) return "";
  return sanitizeHtml(value, plainTextOptions).trim();
};

















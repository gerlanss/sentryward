// SEMA-GOVERNED: module sentryward.scanner; upload guard detects common file upload hazards.
import type { Guard } from "../../types/index.js";
import { scanPatterns } from "../utils.js";

export const uploadsGuard: Guard = {
  name: "uploads",
  run(files, context) {
    return scanPatterns(files, context, [
      {
        ruleId: "SW-UPLOAD-001",
        category: "uploads",
        severity: "high",
        confidence: 0.76,
        pattern: /(multer|upload\.single|formidable|busboy|FileUpload)[\s\S]{0,240}(?!fileSize|limits|sizeLimit|maxFileSize)/gi,
        tags: ["size-limit"],
      },
      {
        ruleId: "SW-UPLOAD-002",
        category: "uploads",
        severity: "medium",
        confidence: 0.82,
        pattern: /(originalname|filename)\s*[,)]|path\.join\([^)]*(originalname|filename)/gi,
        tags: ["filename"],
      },
      {
        ruleId: "SW-UPLOAD-003",
        category: "uploads",
        severity: "high",
        confidence: 0.78,
        pattern: /(uploads?|files?)\/(public|static)|public\/uploads|static\/uploads/gi,
        tags: ["public-upload"],
      },
    ]);
  },
};

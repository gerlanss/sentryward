import multer from "multer";

const upload = multer({ dest: "public/uploads" });

export const handler = upload.single("file");

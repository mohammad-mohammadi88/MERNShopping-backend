import type { UploadedFile } from "express-fileupload";

export default (file: UploadedFile): string => decodeURIComponent(file.name);

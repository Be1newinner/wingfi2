import { bucket } from "@/config/firebaseInit";
import path from "path";
import { v4 as uuidv4 } from "uuid";
// import type { Multer } from "multer";

/**
 * Uploads a file buffer to Firebase Storage and returns its public URL
 * @param file The Multer file object (memory storage)
 * @param destination Optional folder path inside the bucket
 * @returns Public URL of the uploaded file
 */

export async function uploadFileToFirebaseStorage(
  file: Express.MulterMulter.File,
  destination: string = "wingfi"
): Promise<string> {
  const extension = path.extname(file.originalname);
  const filename = `${uuidv4()}-${Date.now()}${extension}`;

  const destinationPath = destination ? `${destination}/${filename}` : filename;

  const fileRef = bucket.file(destinationPath);

  await fileRef.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  await fileRef.makePublic(); // or use signed URL if privacy needed

  return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
}
export async function deleteFileFromFirebaseStorage(fileUrl: string) {
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;

  if (!fileUrl || !fileUrl.startsWith(baseUrl)) {
    return {
      error: "Invalid file URL",
      deleted: false,
      url: fileUrl,
    };
  }

  try {
    const filePath = fileUrl.replace(baseUrl, "");
    await bucket.file(filePath).delete();

    return { url: fileUrl, deleted: true };
  } catch (err) {
    return {
      error: (err as Error).message,
      deleted: false,
      url: fileUrl,
    };
  }
}
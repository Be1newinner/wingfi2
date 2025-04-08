import { bucket } from "@/config/firebaseInit";
import path from "node:path";

export async function uploadFileToFirestore(filePath, destination: string) {
  const newFileName = Date.now() + path.extname(filePath.originalname);
  const destinationPath = destination
    ? `rabbit-turtle/${destination}/${newFileName}`
    : `rabbit-turtle/${newFileName}`;

  await bucket.upload(filePath.path, { destination: destinationPath });

  await bucket.file(destinationPath).makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

  return publicUrl;
}

export async function deleteFileFromFirestore(fileUrl: string) {
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;

  if (!fileUrl || !fileUrl.startsWith(baseUrl)) {
    throw new Error(
      "Invalid file URL. Must be from the correct Firebase Storage bucket."
    );
  }

  const filePath = fileUrl.replace(baseUrl, "");

  await bucket.file(filePath).delete();

  return { baseUrl, deleted: true };
}

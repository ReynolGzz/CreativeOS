import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function uploadImageFromUrl(url: string, filename: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: "image/png" });
  const result = await utapi.uploadFiles(file);
  if (result.error) throw new Error(result.error.message);
  return result.data.url;
}

export async function deleteImage(key: string): Promise<void> {
  await utapi.deleteFiles(key);
}

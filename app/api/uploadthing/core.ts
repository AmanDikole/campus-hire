import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define a "route" for resumes
  resumeUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      // Only logged-in users can upload
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
import authOptions from "@/app/auth/authOptions";
import Editor from "@/components/editor";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { cache } from "react";

interface Params {
  params: { postId: string };
}

const fetchPost = cache((postId: string) =>
  prisma.post.findUnique({ where: { id: postId } })
);

const EditorPage = async ({ params: { postId } }: Params) => {
  const post = await fetchPost(postId);

  if (!post) notFound();

  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      <Editor
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
          image: post.image || "",
        }}
      />
    </div>
  );
};
export default EditorPage;

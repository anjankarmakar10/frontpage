import { getCurrentUser } from "@/app/auth/sessions";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { PostCreateButton } from "@/components/post-create-button";
import PostStatusFilter from "@/components/post-status-filter";
import Posts from "@/components/posts";
import prisma from "@/prisma/client";
import { Metadata } from "next";

interface Props {
  searchParams: {
    published: string;
  };
}

const ManagePostsPage = async ({ searchParams }: Props) => {
  const user = await getCurrentUser();
  if (!user || !user?.email) return null;

  const status =
    searchParams.published === "true"
      ? true
      : searchParams.published === undefined
      ? undefined
      : false;

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.email,
      published: status,
    },
  });

  return (
    <section className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-bold text-3xl md:text-4xl">Posts</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage posts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <PostStatusFilter />
          <PostCreateButton />
        </div>
      </div>

      <div>
        {posts?.length === 0 && status === undefined ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </section>
  );
};

export const metadata: Metadata = {
  title: "Dashboard | Manage Post",
  description: "Manage post page",
};

export default ManagePostsPage;

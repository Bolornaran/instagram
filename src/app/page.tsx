"use client";
import { Button } from "@/components/ui/button";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { useUser } from "@/providers/AuthProvider";
import { Heart, HeartCrack , MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link"

type PostType = {
  _id: string;
  like: string[];
  user: {
    username: string;
    email: string;
    bio: string | null;
    profilePicture: string | null;
    followers: string[];
    following: string[];
    _id: string;
  };
  images: string[];
  caption: string;
};




export default function Home() {
  const { token, user } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState<PostType[]>();

  const myId = user?._id;

  const fetchPosts = async () => {
    const response = await fetch("http://localhost:5555/post/all-posts", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const posts = await response.json();
      setPosts(posts);
    } else {
      toast.error("aldaa garlaa");
    }
  };

  const postLike = async (postId: string) => {
    const response = await fetch(
      `http://localhost:5555/post/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      toast.success("like darlaa");
      await fetchPosts();
    }
  };

  const pushToComment = (postId:string) => {
    push(`/comment/${postId}`)
  }

  const followUser = async (followedUserId: string) => {
    const response = await fetch (
      `http://localhost:5555/follow-toggle/${followedUserId}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );

    if (response.ok) {
      toast.success("follow darla");
    } else {
      toast.error("amjiltgui");
    }
  };

  // useEffect(() => {
  //   if (!token) push("/signup");
  //   fetchPosts();
  // }, [token]);

    useEffect(() => {
    if (token) {
      fetchPosts();
    }
    
  }, [token]);

  return (
    <div>
      <Header />
      {posts?.map((post) => {
        return (
          <div
            key={post._id}
            className="max-w-md mx-auto border border-gray-200 rounded-md shadow-sm mb-6 bg-white"
          >
            <div className="flex items-center p-3">
              <img
                src={post.user.profilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="flex column">
                <span className="font-semibold text-sm">
                  {post.user.username}
                </span>
              </div>
            </div>

            {post.images[0] && (
              <img
                src={post.images[0]}
                alt="post"
                className="w-full object-cover max-h-[500px]"
              />
            )}

            <div className="flex items-center space-x-4 px-3 pt-2">
              <button onClick={() => postLike(post._id)}>
                {myId && post.like.includes(myId) ? (
                  <Heart className="text-red-500 fill-red-500" />
                ) : (
                  <HeartCrack />
                )}
              </button>
              
              <button
              onClick = {() => pushToComment(post._id)}>
                <MessageCircle  />
              </button>
             
              
             

            </div>
              
            <div className="px-3 py-2">
              <p className="text-sm font-semibold">{post.like.length} likes</p>
              <p className="text-sm">
                <span className="font-semibold mr-1">{post.user.username}</span>
                {post.caption}
              </p>
              <Button
                variant="secondary"
                onClick={() => followUser(post.user._id)}
              >
                Follow
              </Button>
            </div>
          </div>
        );
      })}
      <Footer />
    </div>
  );
}

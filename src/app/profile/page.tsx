"use client";
import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { PostType } from "../page";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  _id: string;
  followers: string[];
  following: string[];
};

const Page = () => {
  const { user, token } = useUser();
  const userId = user?._id;
  // const [userInfo,setUserInfo] = useState<PostType[] | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchUserData = async () => {
    const response = await fetch(
      `http://localhost:5555/post/profile/${userId}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    }
  };

  useEffect(() => {
    if(token) {
      fetchUserData();
    }
  }, [token, userId]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-8 pb-10 border-b border-gray-300">
        <img
          src={user?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
          {user?.bio && <p className="text-gray-600 mt-1">{user.bio}</p>}
          <div className="flex gap-6 mt-4 text-sm">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{user?.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user?.following?.length || 0}</strong> following
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mt-8">
        {posts.map((post) => (
          <img
            key={post._id}
            src={post.images?.[0] || "/placeholder.png"}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

"use client";
import { PostType } from "@/app/page";
import {    useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { useEffect , useState } from "react";

type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
  _id: string;
  followers:string[];
 following:string[];
};

const Page = () => {
  
    const { token} = useUser();

    const params = useParams();

    const [userInfo,setUserInfo] = useState<User | null>();
    const [posts,setPosts] = useState<PostType[]>([]);

    const fetchUserData = async () => {
    const response = await fetch(`http://localhost:5555/user-info/${params.userId}` , {
        headers : {
         authorization: `Bearer ${token}`,
        }
    });

    const user = await response.json();

    setUserInfo(user);
    };

    const fetchUseraPosts = async() => {
 
         const response = await fetch(
            `http://localhost:5555/post/user-posts/${params.userId}` , {
        headers : {
         authorization: `Bearer ${token}`,
      }
    });

 
    const posts = await response.json();

    setPosts(posts);
    }

    useEffect(() => {
        if(token){
            fetchUserData();
fetchUseraPosts();            
        } 
    }, [token]);
 

return(
<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={userInfo?.profilePicture || "https://picsum.photos/seed/avatar/100/100"}
            alt="Profile"
            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{userInfo?.username}</h2>
            <div style={{ display: "flex", gap: "15px", fontWeight: "bold", marginTop: "5px" }}>
              <div>{posts.length} posts</div>
              <div>{userInfo?.followers} followers</div>
              <div>{userInfo?.following} following</div>
            </div>
          </div>
        </div>


  
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "5px",
        }}
      >
        {posts.map(post => (
          <div
            key={post._id}
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
              overflow: "hidden",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={post.images}
              alt=""
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;


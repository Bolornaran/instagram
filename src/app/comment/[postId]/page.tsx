"use client"
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type inputValues = {
   comment:string;
}  

type CommentType = {
  _id: string;
  comment: string;
  user: { username: string };
  createdAt: string;
};

const Page = () => {
const { user , token} = useUser();
const [comments , setComments] = useState<CommentType[]>([])
const params = useParams()
 const postId = params.postId 
const [inputValues, setInputValues] = useState<inputValues>({
     
     comment: ""
})
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
   setInputValues((prev) => ({ ...prev, [name]: value }));
  };
 const { push } = useRouter();
const router = useRouter();


 const fetchComments = async () => {
    const response = await fetch(`http://localhost:5555/comment/get/${postId}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setComments(data);
    } else {
      toast.error("failed comments");
    }
  };

const postComment = async() => {
  const response = await fetch(
      "http://localhost:5555/comment/create",
      {
        method: "POST",
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        postId : postId,
        comment: inputValues.comment,
        })
      }
    );
    await fetchComments()
    if (response.ok) {
      toast.success("comment bichlee");
    }
  };

   useEffect(() => {
    if (token && postId) {
      fetchComments();
    }
  }, [token, postId]);

  console.log(comments, "buh comments")

  
  return(
    <div>
    <Input
     placeholder="Write here"
     name="comment"
     value={inputValues.comment}
     onChange={handleInputChange}
      ></Input>
      
      <Button onClick={postComment}>post</Button> 
       <div className="mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="border-b py-2">
            <p>{comment.comment}</p>
            <small className="text-gray-500">by {comment.user.username}</small>
          </div>
))}
    </div>
    </div>
  )
}

export default Page ;


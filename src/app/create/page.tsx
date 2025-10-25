"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner"


const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUser();

   const HF_API_KEY = process.env.HF_API_KEY;
 

  const generateImg = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true)
    setImgUrl("");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry , bad quality , distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status:${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], "generated.png", { type: "image/png" });

      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImgUrl(uploaded.url);
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate img");
      setIsLoading(false);
    }
  };

  const createdPost = async () => {
    const response = await fetch("http://localhost:5555/post/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: caption,
        images: [imgUrl],
      }),
    });
    if (response.ok) {
      toast.success("successdully posted");
    } else {
      toast.error("could not post");
    }
  };

  return (
    <div>
      <div>
        <div className="text-3xl font-bold text-center mb-2 text-gray-800">
          AI image generator
        </div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Describe your image:
        </div>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-100 p-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          disabled={isLoading}
        ></Input>
        <Button onClick={generateImg} className="">
          Generate image
        </Button>

        <Input
          className="w-100"
          placeholder="Add a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></Input>

        {isLoading && <div className="text-gray-700">This may take 30sec</div>}
        {imgUrl && (
          <div>
            <div>
              <h2>Your generated image</h2>
              <img src={imgUrl} />
            </div>
          </div>
        )}
      </div>
      <Button onClick={createdPost} disabled={!imgUrl}>
        create post
      </Button>
    </div>
  );
};

export default Page;



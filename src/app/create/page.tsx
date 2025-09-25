"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImg = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
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
      const imgUrl = URL.createObjectURL(blob);

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImgUrl(imgUrl);
    } catch (err) {
      setIsLoading(false);
    }
  };

  console.log(imgUrl);

  return (
    <div>
      <div>AI image generator</div>
      <div>describe your image:</div>
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)}></Input>
      <Button onClick={generateImg}>Generate image</Button>

      {isLoading && <div>This may take 30sec</div>}

      {imgUrl && (
        <div>
          <h2>Your generated image</h2>
          <img src={imgUrl} />
        </div>
      )}
    </div>
  );
};

export default Page;

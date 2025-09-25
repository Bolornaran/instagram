"use client";

import { Button } from "@/components/ui/button";
import { POST_LOGO } from "@/icons/post-logo";

const Page = () => {
  return (
    <div>
      <div>New photo post</div>
      <POST_LOGO />
      <Button>photo library</Button>
      <Button>Generate with AI</Button>
    </div>
  );
};

export default Page;

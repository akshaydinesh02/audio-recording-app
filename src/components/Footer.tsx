import { useCallback } from "react";
import { GitHub } from "../Icons/GitHub";
import { Twitter } from "../Icons/Twitter";
import Button from "./Button";

const Footer = () => {
  const onClickTwitter = useCallback(() => {
    window.open("https://twitter.com/akshaydinesh02", "_blank");
  }, []);

  const onClickGitHub = useCallback(() => {
    window.open("https://github.com/akshaydinesh02", "_blank");
  }, []);

  return (
    <div className="text-header bg-neutral-900 text-center py-3 z-10 w-full flex justify-center items-center gap-4">
      <Button
        onClick={onClickTwitter}
        type="button"
        className="bg-neutral-800 rounded-full p-2"
      >
        <Twitter />
      </Button>
      <Button
        onClick={onClickGitHub}
        type="button"
        className="bg-neutral-800 rounded-full p-2"
      >
        <GitHub />
      </Button>
    </div>
  );
};

export default Footer;

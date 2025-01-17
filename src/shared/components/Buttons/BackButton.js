import { Link } from "react-router-dom";
import Button from "./Button";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";

function BackButton({ url = "/" }) {
  return (
    <Link to={url}>
      <Button btnType='dismissable'>
        <ArrowLongLeftIcon aria-hidden="true" className="size-5" />
        Back
      </Button>
    </Link>
  );
}

export default BackButton;

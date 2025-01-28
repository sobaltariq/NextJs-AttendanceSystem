import Link from "next/link";
import { useFormStatus } from "react-dom";

export const SubmitButton: React.FC<SubmitButtonInterface> = ({
  label = "Submit",
  className = "primary-button",
  isLoading = false,
}) => {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      className={className}
      value={label}
      disabled={pending || pending}
    />
  );
};

export const NavigateLink: React.FC<NavigateLinkInterface> = ({
  label = "Submit",
  className = "navigation-link-primary",
  link = "/",
}) => {
  return (
    <Link href={link} type="submit" className={className}>
      {label}
    </Link>
  );
};

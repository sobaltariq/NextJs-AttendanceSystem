import Link from "next/link";
import { useFormStatus } from "react-dom";

export const SubmitButton: React.FC<SubmitButtonInterface> = ({
  label = "Submit",
  className = "btn-primary",
  isLoading = false,
}) => {
  const { pending } = useFormStatus();
  return (
    <input
      type="submit"
      className={className}
      value={label}
      disabled={pending || isLoading}
    />
  );
};

export const NavigationLink: React.FC<NavigationLinkInterface> = ({
  label = "Submit",
  className = "primary-link",
  link = "/",
}) => {
  return (
    <Link href={link} className={className}>
      <span>{label}</span>
    </Link>
  );
};

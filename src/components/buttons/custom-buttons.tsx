import { useFormStatus } from "react-dom";

export const SubmitButton: React.FC<ISubmitButton> = ({
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

import { useFormStatus } from "react-dom";

export const SubmitButton: React.FC<ISubmitButton> = ({
  label = "Submit",
  className = "primary-button",
}) => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {label}
    </button>
  );
};

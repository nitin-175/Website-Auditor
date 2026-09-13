import { Play } from "lucide-react";
import Button from "../common/Button";

function AuditButton({
  disabled = false,
  onClick,
}) {
  return (
    <Button
      type="button"
      size="large"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      className="sm:w-auto sm:min-w-48"
    >
      <Play size={16} fill="currentColor" />
      Start Audit
    </Button>
  );
}

export default AuditButton;
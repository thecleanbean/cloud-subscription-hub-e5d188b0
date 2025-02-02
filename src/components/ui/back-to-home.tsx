import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./button";

export const BackToHome = () => {
  return (
    <Button
      asChild
      variant="outline"
      className="fixed bottom-4 right-4 z-50"
      size="sm"
    >
      <Link to="/" className="flex items-center gap-2">
        <Home className="w-4 h-4" /> Home
      </Link>
    </Button>
  );
};
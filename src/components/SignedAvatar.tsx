import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignedUrl } from "@/hooks/useSignedUrl";

interface SignedAvatarProps {
  photoUrl: string | null | undefined;
  fallbackText: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Avatar component that automatically resolves storage paths to signed URLs.
 */
const SignedAvatar = ({ photoUrl, fallbackText, className = "w-10 h-10", fallbackClassName = "bg-primary/10 text-primary" }: SignedAvatarProps) => {
  const resolvedUrl = useSignedUrl(photoUrl);

  return (
    <Avatar className={className}>
      <AvatarImage src={resolvedUrl || ""} />
      <AvatarFallback className={fallbackClassName}>
        {fallbackText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default SignedAvatar;

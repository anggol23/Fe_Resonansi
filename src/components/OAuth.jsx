import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

const API_URL = import.meta.env.VITE_API_URL;

export default function OAuth() {
  const handleGoogleClick = () => {
    // Arahkan pengguna ke backend untuk autentikasi Google
    window.location.href = `${API_URL}/api/auth/google`; 
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}

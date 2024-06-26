import { FaFingerprint } from "react-icons/fa";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex justify-center items-center text-center">
      <div className="max-w-md p-8 rounded-lg shadow text-gray-800">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-4">
          Oops! It seems you don&apos;t have the necessary permissions to access
          this page. Please log in with authorized credentials.
        </p>

        <div className="mx-auto w-32 h-32 my-12 lightning-gradient">
          <FaFingerprint className="h-full w-full text-yellow-300" />
        </div>

        <p className="text-gray-800">Thank you for your understanding.</p>
      </div>
    </div>
  );
}
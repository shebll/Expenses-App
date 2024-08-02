import { userQueryOption } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { error, isLoading, data } = useQuery(userQueryOption);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorHandleUI />;
  if (!data?.user) return <UnauthorizedUI />;

  return <UserProfile user={data.user} />;
};

export default Profile;

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-secondary"></div>
      <div className="w-32 h-6 rounded-md bg-secondary"></div>
      <div className="w-48 h-4 rounded-md bg-secondary"></div>
      <div className="w-40 h-4 rounded-md bg-secondary"></div>
    </div>
  );
};
const ErrorHandleUI = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg font-bold text-red-600">An error occurred</div>
      <div className="text-gray-600">Please try again later.</div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 text-white bg-red-600 rounded-md"
      >
        Reload
      </button>
      <UnauthorizedUI />
    </div>
  );
};

const UserProfile = ({
  user,
}: {
  user: {
    picture: null | string;
    family_name: string;
    given_name: string;
    email: string;
    id: string;
  };
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg shadow-lg">
      <img
        src={user.picture || "/default-avatar.png"}
        alt="User Avatar"
        className="object-cover w-24 h-24 rounded-full"
      />
      <div className="text-lg font-semibold">
        {user.given_name} {user.family_name}
      </div>
      <div className="text-gray-600">{user.email}</div>
    </div>
  );
};

const UnauthorizedUI = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg font-bold text-red-600">Unauthorized Access</div>
      <div className="text-gray-600">
        You do not have permission to view this page.
      </div>
      <button
        onClick={() => (window.location.href = "/api/login")}
        className="px-4 py-2 text-white bg-blue-600 rounded-md"
      >
        Go to Login
      </button>
    </div>
  );
};

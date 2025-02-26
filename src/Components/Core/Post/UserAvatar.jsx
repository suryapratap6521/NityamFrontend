export default function UserAvatar({ user, className }) {
    return (
      <img
        src={user?.image || 'https://via.placeholder.com/150'}
        alt={`${user?.firstName} ${user?.lastName}`}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }
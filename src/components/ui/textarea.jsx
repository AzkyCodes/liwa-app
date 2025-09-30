export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring focus:border-blue-400 ${className}`}
      {...props}
    />
  );
}

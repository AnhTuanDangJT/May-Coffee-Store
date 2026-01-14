type FormMessageProps = {
  type: "error" | "success";
  message: string;
};

const styles = {
  error: "bg-[#ffecea] text-[#b5483e] border-[#f4b1a8]",
  success: "bg-[#e8f7f0] text-[#2f7f68] border-[#9fdcc6]",
};

export const FormMessage = ({ type, message }: FormMessageProps) => {
  if (!message) return null;
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles[type]}`}
    >
      {message}
    </div>
  );
};


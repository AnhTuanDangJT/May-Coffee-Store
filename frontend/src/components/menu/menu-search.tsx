"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type MenuSearchProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export const MenuSearch = ({ value, placeholder, onChange }: MenuSearchProps) => {
  return (
    <Input
      leadingIcon={<Search size={18} />}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="shadow-[0_12px_30px_rgba(114,74,36,0.15)]"
    />
  );
};



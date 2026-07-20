"use client";

import { useState } from "react";
import { updateHolding } from "@/app/portfolio/actions";

export default function PromoteToHoldingForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 underline"
      >
        Add shares
      </button>
    );
  }

  return (
    <form action={updateHolding} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="shares"
        type="number"
        step="any"
        min="0"
        placeholder="Shares"
        required
        className="w-20 rounded border px-2 py-1 text-sm"
      />
      <input
        name="costBasis"
        type="number"
        step="any"
        min="0"
        placeholder="Cost/share"
        className="w-24 rounded border px-2 py-1 text-sm"
      />
      <button
        type="submit"
        className="rounded bg-black px-2 py-1 text-sm text-white"
      >
        Save
      </button>
    </form>
  );
}

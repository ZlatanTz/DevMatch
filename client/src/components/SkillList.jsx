import { useState, useEffect, useMemo } from "react";
import SkillTag from "./SkillTag";

export default function SkillList({
  names = [],
  max = 8,
  pageSize = 5,
  value, // optional controlled: string[]
  defaultValue = [], // uncontrolled initial selection
  onChange, // (selected: string[]) => void
  clickable = false,
}) {
  // Normalize names -> array of strings
  const list = useMemo(() => {
    if (Array.isArray(names)) return names;
    if (typeof names === "string") {
      // supports CSV string "JS, React ,Node"
      return names
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (names && typeof names === "object") {
      // supports map/object { id: "React", ... }
      return Object.values(names).map(String);
    }
    return [];
  }, [names]);

  // Controlled vs uncontrolled
  const isControlled = Array.isArray(value);
  const controlledArray = isControlled ? value : undefined;

  const [currentMax, setCurrentMax] = useState(max);
  const [internal, setInternal] = useState(
    new Set(Array.isArray(defaultValue) ? defaultValue : []),
  );

  // keep currentMax in sync
  useEffect(() => setCurrentMax(max), [max]);

  // prune internal selection when the list changes
  useEffect(() => {
    setInternal((prev) => new Set([...prev].filter((s) => list.includes(s))));
  }, [list]);

  const selectedSet = useMemo(
    () => (isControlled ? new Set(controlledArray) : internal),
    [isControlled, controlledArray, internal],
  );

  const updateSelection = (nextSet) => {
    if (!isControlled) setInternal(nextSet);
    onChange?.([...nextSet]); // always emit array of names
  };

  const toggle = (name) => {
    const next = new Set(selectedSet);

    next.has(name) ? next.delete(name) : next.add(name);
    updateSelection(next);
  };

  const shown = useMemo(() => list.slice(0, currentMax), [list, currentMax]);
  const extra = list.length - shown.length;

  return (
    <div className="flex gap-2 flex-wrap">
      {shown.map((name) => (
        <SkillTag
          key={name}
          isSelected={selectedSet.has(name)}
          onClick={clickable ? () => toggle(name) : undefined}
          clickable={clickable}
        >
          {name}
        </SkillTag>
      ))}

      {extra > 0 &&
        (clickable ? (
          <button
            type="button"
            onClick={() => setCurrentMax((n) => n + pageSize)}
            className="px-2 py-1 rounded bg-emerald hover:bg-emerald/80 text-white text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Load more
          </button>
        ) : (
          <span className="px-2 py-1 rounded bg-gray-300 text-gray-700 text-xs">+{extra} more</span>
        ))}
    </div>
  );
}

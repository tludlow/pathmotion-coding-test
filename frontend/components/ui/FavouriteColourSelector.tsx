import { useState } from "react";

type FavouriteColourSelectionProps = {
  initialColour: string;
  mutateFunction: any;
};
export default function FavouriteColourSelection({
  initialColour,
  mutateFunction,
}: FavouriteColourSelectionProps) {
  const [selectedColour, setSelectedColour] = useState(initialColour);

  // When the dropdown selection is changed, grab the new selection and mutate the user's favourite colour
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newColour = e.target.value;
    setSelectedColour(newColour);
    mutateFunction.mutate(newColour);
  };

  return (
    <form>
      <select
        defaultValue={selectedColour}
        onChange={(e) => onChange(e)}
        className="rounded border-2 border-gray-300"
        name="colour"
        id="colour"
      >
        <option value="GREEN">Green</option>
        <option value="RED">Red</option>
        <option value="BLUE">Blue</option>
      </select>
    </form>
  );
}

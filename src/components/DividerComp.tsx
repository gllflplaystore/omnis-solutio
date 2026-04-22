import divider from "@/assets/divider.svg";
import * as Divider from "@/components/ui/Divider";

export default function DividerComp() {
  return (
    <Divider.Root variant='line-text'>
      <img src={divider} alt="Divider" className="mx-auto" />
    </Divider.Root>
  );
}
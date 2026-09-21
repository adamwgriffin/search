import ToggleOpenButton from "@/components/design_system/ToggleOpenButton/ToggleOpenButton";

export default function MenuButtonFallback({ label }: { label: string }) {
  return <ToggleOpenButton label={label} open={false} loading />;
}

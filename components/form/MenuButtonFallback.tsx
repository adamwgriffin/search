import ToggleOpenButton from "@/components/design_system/ToggleOpenButton/ToggleOpenButton";

export type MenuButtonFallbackProps = {
  label: string;
  condensed?: boolean;
};

export default function MenuButtonFallback(props: MenuButtonFallbackProps) {
  return <ToggleOpenButton {...props} open={false} loading />;
}

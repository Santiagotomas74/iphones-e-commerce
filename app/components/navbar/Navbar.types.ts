export interface NavbarProps {
  items: {
    label: string;
    href: string;
  }[];
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}
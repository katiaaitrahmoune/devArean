import { ProtectedPage } from "../components/ProtectedPage"

// Every page under this route requires a logged-in user.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedPage>{children}</ProtectedPage>
}

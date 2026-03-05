export interface RouteItem {
  path: string;
  component: string; // e.g., "LoginPage"
  exact?: boolean;
  protected?: boolean;
  layout?: "main" | "auth" | "none" | "admin" | "app";
  filePath: string;
}
